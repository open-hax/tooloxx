/**
 * MCP tool definitions for the OpenPlanner epistemic kernel.
 *
 * Tools:
 *   openplanner.query-graph       — read graph nodes/edges
 *   openplanner.search-events     — search event store
 *   openplanner.append-fact       — write a Fact record
 *   openplanner.append-obs        — write an Obs record
 *   openplanner.append-inference  — write an Inference record
 *   openplanner.append-attestation — write an Attestation record
 *   openplanner.append-judgment   — write a Judgment record
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { OpenPlannerClient } from "./client.js";
import {
  Fact,
  Obs,
  Inference,
  Attestation,
  Judgment,
  type EpistemicKind,
  validateEpistemic,
} from "./schemas.js";

function textResult(value: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
  };
}

function errorResult(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify({ ok: false, error: message }) }],
    isError: true,
  };
}

export function registerOpenPlannerTools(
  server: McpServer,
  client: OpenPlannerClient,
): void {
  // ---- Read tools ----

  server.registerTool(
    "openplanner.query-graph",
    {
      description: "Query the OpenPlanner knowledge graph for nodes and edges matching a text query. Returns scored results from the configured project.",
      inputSchema: {
        query: z.string().min(1).describe("Text query to search the graph"),
        project: z.string().optional().describe("Project scope (defaults to server config)"),
        lake: z.string().optional().describe("Lake filter: devel, web, bluesky, knoxx-session"),
        nodeType: z.string().optional().describe("Node type filter: docs, file, url, event, etc."),
        limit: z.number().int().min(1).max(20).optional().describe("Max nodes to return (1-20)"),
        edgeLimit: z.number().int().min(0).max(60).optional().describe("Max edges to return (0-60)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    },
    async ({ query, project, lake, nodeType, limit, edgeLimit }): Promise<CallToolResult> => {
      try {
        const result = await client.queryGraph({ query, project, lake, nodeType, limit, edgeLimit });
        return textResult({ ok: true, ...result });
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    },
  );

  server.registerTool(
    "openplanner.search-events",
    {
      description: "Search the OpenPlanner event store for matching observations and events. Returns scored snippets.",
      inputSchema: {
        query: z.string().min(1).describe("Text query to search events"),
        project: z.string().optional().describe("Project scope (defaults to server config)"),
        topK: z.number().int().min(1).max(50).optional().describe("Max results to return (1-50)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    },
    async ({ query, project, topK }): Promise<CallToolResult> => {
      try {
        const result = await client.searchEvents({ query, project, topK });
        return textResult({ ok: true, ...result });
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    },
  );

  // ---- Write tools ----

  server.registerTool(
    "openplanner.append-fact",
    {
      description: "Append a Fact to the epistemic kernel. A Fact is a principal asserting a proposition is true. Validated against promptdb-core schema before persisting.",
      inputSchema: {
        fact: Fact.describe("Fact record matching promptdb-core schema"),
        project: z.string().optional().describe("Project scope"),
        source: z.string().optional().describe("Source identifier"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    async ({ fact, project, source }): Promise<CallToolResult> => {
      try {
        validateEpistemic("fact", fact);
        const result = await client.appendEpistemic("fact", fact, project, source);
        return textResult(result);
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    },
  );

  server.registerTool(
    "openplanner.append-obs",
    {
      description: "Append an Obs (observation) to the epistemic kernel. An Obs is something sensed but not yet validated. Validated against promptdb-core schema.",
      inputSchema: {
        obs: Obs.describe("Observation record matching promptdb-core schema"),
        project: z.string().optional().describe("Project scope"),
        source: z.string().optional().describe("Source identifier"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    async ({ obs, project, source }): Promise<CallToolResult> => {
      try {
        validateEpistemic("obs", obs);
        const result = await client.appendEpistemic("obs", obs, project, source);
        return textResult(result);
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    },
  );

  server.registerTool(
    "openplanner.append-inference",
    {
      description: "Append an Inference to the epistemic kernel. An Inference is a derived proposition from applying a contract to evidence. Validated against promptdb-core schema.",
      inputSchema: {
        inference: Inference.describe("Inference record matching promptdb-core schema"),
        project: z.string().optional().describe("Project scope"),
        source: z.string().optional().describe("Source identifier"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    async ({ inference, project, source }): Promise<CallToolResult> => {
      try {
        validateEpistemic("inference", inference);
        const result = await client.appendEpistemic("inference", inference, project, source);
        return textResult(result);
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    },
  );

  server.registerTool(
    "openplanner.append-attestation",
    {
      description: "Append an Attestation to the epistemic kernel. An Attestation is the actor's signature that they did what they said. Validated against promptdb-core schema.",
      inputSchema: {
        attestation: Attestation.describe("Attestation record matching promptdb-core schema"),
        project: z.string().optional().describe("Project scope"),
        source: z.string().optional().describe("Source identifier"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    async ({ attestation, project, source }): Promise<CallToolResult> => {
      try {
        validateEpistemic("attestation", attestation);
        const result = await client.appendEpistemic("attestation", attestation, project, source);
        return textResult(result);
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    },
  );

  server.registerTool(
    "openplanner.append-judgment",
    {
      description: "Append a Judgment to the epistemic kernel. A Judgment is the world's verdict on whether an inference/attestation held. Validated against promptdb-core schema.",
      inputSchema: {
        judgment: Judgment.describe("Judgment record matching promptdb-core schema"),
        project: z.string().optional().describe("Project scope"),
        source: z.string().optional().describe("Source identifier"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    async ({ judgment, project, source }): Promise<CallToolResult> => {
      try {
        validateEpistemic("judgment", judgment);
        const result = await client.appendEpistemic("judgment", judgment, project, source);
        return textResult(result);
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err));
      }
    },
  );
}
