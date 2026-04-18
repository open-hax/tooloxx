/**
 * OpenPlanner MCP Server — exposes the epistemic kernel as MCP tools.
 *
 * Pattern: @workspace/mcp-foundation + Express + Zod.
 * Modeled after threat-radar-mcp.
 */
import "dotenv/config";
import cors from "cors";
import express, { type RequestHandler } from "express";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { createMcpHttpRouter } from "@workspace/mcp-foundation";
import { OpenPlannerClient } from "./client.js";
import { registerOpenPlannerTools } from "./tools.js";

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

const ENV = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(8010),
  PUBLIC_BASE_URL: z.string().url().optional(),
  ADMIN_AUTH_KEY: z.string().min(12).default("change-me-openplanner-mcp"),
  ALLOW_UNAUTH_LOCAL: z.string().optional(),

  OPENPLANNER_BASE_URL: z.string().url().default("http://openplanner:7777"),
  OPENPLANNER_API_KEY: z.string().min(1).default("change-me"),
  OPENPLANNER_DEFAULT_PROJECT: z.string().min(1).default("devel"),
  OPENPLANNER_DEFAULT_SOURCE: z.string().min(1).default("knoxx"),
}).parse(process.env);

const publicBaseUrl = new URL(
  ENV.PUBLIC_BASE_URL ?? process.env.RENDER_EXTERNAL_URL ?? `http://127.0.0.1:${ENV.PORT}`,
);

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function toBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function isLoopbackAddress(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized === "::1" ||
    normalized === "127.0.0.1" ||
    normalized === "::ffff:127.0.0.1" ||
    normalized.startsWith("127.")
  );
}

function isLoopbackRequest(req: express.Request): boolean {
  const remote = req.socket.remoteAddress ?? "";
  const forwardedFor =
    String(req.headers["x-forwarded-for"] ?? "")
      .split(",")[0]
      ?.trim() ?? "";
  const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "").toLowerCase();
  const bareHost = host.startsWith("[") ? host.slice(1, host.indexOf("]")) : host.split(":")[0] ?? "";
  return (
    isLoopbackAddress(remote) &&
    (!forwardedFor || isLoopbackAddress(forwardedFor)) &&
    (!bareHost || bareHost === "localhost" || bareHost === "127.0.0.1" || bareHost === "::1")
  );
}

function requireAdminKey(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const supplied = String(req.headers["x-admin-auth-key"] ?? "");
  if (supplied === ENV.ADMIN_AUTH_KEY) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}

const maybeAdminBypass: RequestHandler = (req, res, next) => {
  if (toBool(ENV.ALLOW_UNAUTH_LOCAL, false) && isLoopbackRequest(req)) {
    next();
    return;
  }
  requireAdminKey(req, res, next);
};

// ---------------------------------------------------------------------------
// OpenPlanner client
// ---------------------------------------------------------------------------

const openplanner = new OpenPlannerClient({
  baseUrl: ENV.OPENPLANNER_BASE_URL,
  apiKey: ENV.OPENPLANNER_API_KEY,
  defaultProject: ENV.OPENPLANNER_DEFAULT_PROJECT,
  defaultSource: ENV.OPENPLANNER_DEFAULT_SOURCE,
});

// ---------------------------------------------------------------------------
// MCP server + tools
// ---------------------------------------------------------------------------

function createServer(): McpServer {
  const server = new McpServer({
    name: "openplanner-mcp",
    version: "0.1.0",
  });
  registerOpenPlannerTools(server, openplanner);
  return server;
}

const mcpRouter = createMcpHttpRouter({
  createServer,
});

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------

const app = express();
app.set("trust proxy", true);
app.use(cors({ origin: "*", exposedHeaders: ["mcp-session-id"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", async (_req, res) => {
  const upstreamHealthy = await openplanner.isHealthy();
  res.json({
    ok: true,
    service: "openplanner-mcp",
    publicBaseUrl: publicBaseUrl.toString(),
    upstream: {
      url: ENV.OPENPLANNER_BASE_URL,
      healthy: upstreamHealthy,
    },
    defaults: {
      project: ENV.OPENPLANNER_DEFAULT_PROJECT,
      source: ENV.OPENPLANNER_DEFAULT_SOURCE,
    },
  });
});

app.post("/mcp", maybeAdminBypass, async (req, res) => {
  await mcpRouter.handlePost(req, res);
});

app.get("/mcp", maybeAdminBypass, async (req, res) => {
  await mcpRouter.handleSession(req, res);
});

app.delete("/mcp", maybeAdminBypass, async (req, res) => {
  await mcpRouter.handleSession(req, res);
});

// ---------------------------------------------------------------------------
// Listen
// ---------------------------------------------------------------------------

const listener = app.listen(ENV.PORT, "0.0.0.0", () => {
  console.log(`[openplanner-mcp] listening on ${ENV.PORT}`);
  console.log(`[openplanner-mcp] public base ${publicBaseUrl.toString()}`);
  console.log(`[openplanner-mcp] upstream ${ENV.OPENPLANNER_BASE_URL}`);
  console.log(`[openplanner-mcp] project=${ENV.OPENPLANNER_DEFAULT_PROJECT} source=${ENV.OPENPLANNER_DEFAULT_SOURCE}`);
});

process.on("SIGINT", () => {
  listener.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  listener.close(() => process.exit(0));
});
