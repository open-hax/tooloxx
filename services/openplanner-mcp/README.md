# openplanner-mcp

MCP server exposing the OpenPlanner epistemic kernel as 7 MCP tools.

## Tools

| Tool | Type | Description |
|---|---|---|
| `openplanner.query-graph` | read | Query knowledge graph for nodes/edges |
| `openplanner.search-events` | read | Search event store for observations |
| `openplanner.append-fact` | write | Append a Fact (principal asserts proposition) |
| `openplanner.append-obs` | write | Append an Obs (sensed, not yet validated) |
| `openplanner.append-inference` | write | Append an Inference (contract-derived proposition) |
| `openplanner.append-attestation` | write | Append an Attestation (actor signature) |
| `openplanner.append-judgment` | write | Append a Judgment (verdict on inference/attestation) |

All write tools validate input against Zod schemas ported from `promptdb-core` Malli definitions before forwarding to the OpenPlanner API.

## Quick start

```bash
# Dev (requires node_modules installed)
pnpm dev

# Build
pnpm build

# Start
pnpm start
```

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8010` | Server listen port |
| `ADMIN_AUTH_KEY` | `change-me-openplanner-mcp` | Auth key for MCP endpoints |
| `ALLOW_UNAUTH_LOCAL` | `false` | Skip auth for loopback requests |
| `OPENPLANNER_BASE_URL` | `http://openplanner:7777` | OpenPlanner API base URL |
| `OPENPLANNER_API_KEY` | `change-me` | API key for OpenPlanner |
| `OPENPLANNER_DEFAULT_PROJECT` | `devel` | Default project scope |
| `OPENPLANNER_DEFAULT_SOURCE` | `knoxx` | Default source scope |

## Endpoints

- `GET /health` — Liveness probe with upstream health check
- `POST /mcp` — MCP tool invocation (JSON-RPC 2.0 over StreamableHTTP)
- `GET /mcp` — MCP session management
- `DELETE /mcp` — MCP session termination

## Architecture

```
Knoxx agent → mcp_bridge.cljs → HTTP → openplanner-mcp → HTTP → openplanner:7777
                                                  ↓
                                          schemas.ts (Zod validation)
```

Uses `@workspace/mcp-foundation` for the HTTP transport layer (StreamableHTTP + session management).
Pattern follows `threat-radar-mcp`.

## Schema sync

The Zod schemas in `src/schemas.ts` are ported from `packages/promptdb-core/src/promptdb/core.cljc` (Malli).
A CI schema-sync test should verify they match.
