import "dotenv/config";
import express from "express";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import {
  threadAssessmentPacketSchema,
  reducePackets,
  EvidenceIndex,
  auditLog,
  inMemoryAuditStore,
  type ThreadAssessmentPacket,
  type ReducedThreadState,
  type ModelSubmission,
} from "@workspace/thread-assessment";

const ENV = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(10001),
  PUBLIC_BASE_URL: z.string().url().optional(),
  ADMIN_AUTH_KEY: z.string().min(12),
  HORMUZ_THREAD_ID: z.string().min(1).default("hormuz"),
  DATABASE_URL: z.string().optional(),
  ALLOW_UNAUTH_LOCAL: z.string().optional(),
}).parse(process.env);

const publicBaseUrl = new URL(ENV.PUBLIC_BASE_URL ?? process.env.RENDER_EXTERNAL_URL ?? `http://127.0.0.1:${ENV.PORT}`);
const threadId = ENV.HORMUZ_THREAD_ID;

const SIGNAL_NAMES = [
  "transit_flow",
  "attack_tempo",
  "insurance_availability",
  "navigation_integrity",
  "bypass_capacity",
  "asia_buffer_stress",
] as const;

const BRANCH_NAMES = [
  "reopening",
  "effective_closure",
  "wider_escalation",
] as const;

const MODEL_WEIGHTS: Record<string, number> = {
  "perplexity-sonar": 0.25,
  "perplexity-sonar-pro": 0.30,
  "gpt-4o": 0.25,
  "claude-3-opus": 0.30,
  "claude-3.5-sonnet": 0.25,
  "gemini-2.0-flash": 0.20,
  "gemini-2.5-pro": 0.28,
};

const auditStore = inMemoryAuditStore();
const logger = auditLog(auditStore);
const evidenceIndex = new EvidenceIndex();
const submissions: ModelSubmission[] = [];

function getModelWeight(modelId: string): number {
  return MODEL_WEIGHTS[modelId] ?? 0.20;
}

async function submitPacket(packet: ThreadAssessmentPacket): Promise<{ submissionId: string; weighted: number }> {
  const weight = getModelWeight(packet.model_id);
  const submission: ModelSubmission = {
    packet,
    weight,
    receivedAt: new Date().toISOString(),
  };

  submissions.push(submission);
  evidenceIndex.indexBatch(packet.sources);

  const submissionId = await logger.logSubmission(packet, {
    weight,
    signalCount: Object.keys(packet.signal_scores).length,
    branchCount: packet.branch_assessment.length,
    sourceCount: packet.sources.length,
  });

  return { submissionId, weighted: weight };
}

async function getReducedState(): Promise<ReducedThreadState | null> {
  if (submissions.length === 0) return null;

  const state = reducePackets(submissions, [...SIGNAL_NAMES], [...BRANCH_NAMES]);

  await logger.logReduction(state, submissions.map((s) => s.packet.model_id));

  return state;
}

async function listSubmissions(): Promise<Array<{ modelId: string; weight: number; receivedAt: string; sourceCount: number }>> {
  return submissions.map((s) => ({
    modelId: s.packet.model_id,
    weight: s.weight,
    receivedAt: s.receivedAt,
    sourceCount: s.packet.sources.length,
  }));
}

async function getEvidenceSummary(): Promise<ReturnType<EvidenceIndex["getSummary"]>> {
  evidenceIndex.dedupeByUrl();
  return evidenceIndex.getSummary();
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const supplied = String(req.headers["x-admin-auth-key"] ?? "");
  if (supplied === ENV.ADMIN_AUTH_KEY) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}

const app = express();
const jsonParser = express.json({ limit: "1mb" });

app.set("trust proxy", true);

app.get("/health", async (_req, res) => {
  const state = await getReducedState();
  res.json({
    ok: true,
    service: "hormuz-clock-mcp",
    publicBaseUrl: publicBaseUrl.toString(),
    threadId,
    submissionCount: submissions.length,
    evidenceSummary: evidenceIndex.getSummary(),
    reducedState: state
      ? {
          threadId: state.threadId,
          asOfUtc: state.asOfUtc,
          modelCount: state.modelCount,
          disagreementIndex: state.disagreementIndex,
          qualityScore: state.qualityScore,
        }
      : null,
  });
});

const server = new McpServer({
  name: "hormuz-clock-mcp",
  version: "0.1.0",
});

server.tool(
  "hormuz_submit_packet",
  "Submit a thread assessment packet from a model backend",
  {
    packet: threadAssessmentPacketSchema,
  },
  async ({ packet }): Promise<CallToolResult> => {
    const result = await submitPacket(packet);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              submissionId: result.submissionId,
              weight: result.weighted,
              threadId: packet.thread_id,
              modelId: packet.model_id,
              signalCount: Object.keys(packet.signal_scores).length,
              branchCount: packet.branch_assessment.length,
              sourceCount: packet.sources.length,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  "hormuz_get_reduced_state",
  "Get the current reduced clock state from all submitted packets",
  {},
  async (): Promise<CallToolResult> => {
    const state = await getReducedState();
    if (!state) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: false, error: "No submissions available" }, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              state,
              signalLabels: {
                transit_flow: "0=normal, 1=stressed, 2=degraded, 3=impaired, 4=broken",
                attack_tempo: "0=normal, 1=stressed, 2=degraded, 3=impaired, 4=broken",
                insurance_availability: "0=normal, 1=stressed, 2=degraded, 3=impaired, 4=broken",
                navigation_integrity: "0=normal, 1=stressed, 2=degraded, 3=impaired, 4=broken",
                bypass_capacity: "0=normal, 1=stressed, 2=degraded, 3=impaired, 4=broken",
                asia_buffer_stress: "0=normal, 1=stressed, 2=degraded, 3=impaired, 4=broken",
              },
              branchLabels: {
                reopening: "Likelihood of transit returning to normal levels",
                effective_closure: "Likelihood of sustained disruption",
                wider_escalation: "Likelihood of regional conflict expansion",
              },
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  "hormuz_list_submissions",
  "List all submitted packets for the current thread",
  {},
  async (): Promise<CallToolResult> => {
    const list = await listSubmissions();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              threadId,
              submissionCount: list.length,
              submissions: list,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  "hormuz_get_evidence_summary",
  "Get summary of the evidence index",
  {},
  async (): Promise<CallToolResult> => {
    const summary = await getEvidenceSummary();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              threadId,
              evidence: summary,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

const maybeBearer: express.RequestHandler = (req, res, next) => {
  if (toBool(ENV.ALLOW_UNAUTH_LOCAL, false) && isLoopbackRequest(req)) {
    next();
    return;
  }
  requireAdmin(req, res, next);
};

app.post("/mcp", jsonParser, maybeBearer, async (req, res) => {
  try {
    // Note: MCP SDK connect() expects a Transport, not a raw socket.
    // This endpoint needs proper transport implementation.
    // const body = req.body;
    // await server.server.connect(transport);
    res.status(501).json({ error: "MCP over HTTP not implemented - use stdio transport" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const listener = app.listen(ENV.PORT, "0.0.0.0", () => {
  console.log(`[hormuz-clock-mcp] listening on ${ENV.PORT}`);
  console.log(`[hormuz-clock-mcp] public base ${publicBaseUrl.toString()}`);
  console.log(`[hormuz-clock-mcp] thread ${threadId}`);
});

process.on("SIGINT", () => {
  listener.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  listener.close(() => process.exit(0));
});

function toBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function isLoopbackRequest(req: express.Request): boolean {
  const remote = req.socket.remoteAddress ?? "";
  const forwardedFor = String(req.headers["x-forwarded-for"] ?? "").split(",")[0]?.trim() ?? "";
  const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "").toLowerCase();
  const bareHost = host.startsWith("[") ? host.slice(1, host.indexOf("]")) : host.split(":")[0] ?? "";
  return isLoopbackAddress(remote) && (!forwardedFor || isLoopbackAddress(forwardedFor)) && (!bareHost || bareHost === "localhost" || bareHost === "127.0.0.1" || bareHost === "::1");
}

function isLoopbackAddress(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized === "::1" || normalized === "127.0.0.1" || normalized === "::ffff:127.0.0.1" || normalized.startsWith("127.");
}
