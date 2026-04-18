/**
 * HTTP client for the OpenPlanner API.
 *
 * Wraps the graph query, event search, and epistemic write endpoints
 * that the MCP server exposes as tools.
 */
import type { EpistemicKind } from "./schemas.js";

export type OpenPlannerClientConfig = Readonly<{
  baseUrl: string;
  apiKey: string;
  defaultProject: string;
  defaultSource: string;
}>;

export type GraphQueryResult = {
  nodes: Array<{ id: string; label: string; type: string; score: number }>;
  edges: Array<{ source: string; target: string; label: string }>;
  annotations: { project: string; totalMatches: number };
};

export type EventSearchResult = {
  events: Array<{ id: string; kind: string; score: number; snippet: string }>;
  total: number;
};

export type WriteResult = {
  ok: boolean;
  id: string;
  kind: EpistemicKind;
  project: string;
  source: string;
};

export class OpenPlannerClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultProject: string;
  private readonly defaultSource: string;

  constructor(config: OpenPlannerClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
    this.defaultProject = config.defaultProject;
    this.defaultSource = config.defaultSource;
  }

  private async request(path: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
        ...options.headers,
      },
    });
    return res;
  }

  /**
   * Query the OpenPlanner knowledge graph.
   */
  async queryGraph(params: {
    query: string;
    project?: string;
    lake?: string;
    nodeType?: string;
    limit?: number;
    edgeLimit?: number;
  }): Promise<GraphQueryResult> {
    const project = params.project ?? this.defaultProject;
    const searchParams = new URLSearchParams({
      q: params.query,
      project,
    });
    if (params.lake) searchParams.set("lake", params.lake);
    if (params.nodeType) searchParams.set("nodeType", params.nodeType);
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.edgeLimit) searchParams.set("edgeLimit", String(params.edgeLimit));

    const res = await this.request(`/api/graph/query?${searchParams.toString()}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenPlanner graph query failed (${res.status}): ${text}`);
    }
    return res.json() as Promise<GraphQueryResult>;
  }

  /**
   * Search events in the OpenPlanner event store.
   */
  async searchEvents(params: {
    query: string;
    project?: string;
    topK?: number;
  }): Promise<EventSearchResult> {
    const project = params.project ?? this.defaultProject;
    const searchParams = new URLSearchParams({
      q: params.query,
      project,
    });
    if (params.topK) searchParams.set("top_k", String(params.topK));

    const res = await this.request(`/api/events/search?${searchParams.toString()}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenPlanner event search failed (${res.status}): ${text}`);
    }
    return res.json() as Promise<EventSearchResult>;
  }

  /**
   * Append an epistemic record (fact, obs, inference, attestation, judgment).
   */
  async appendEpistemic(
    kind: EpistemicKind,
    record: unknown,
    project?: string,
    source?: string,
  ): Promise<WriteResult> {
    const res = await this.request(`/api/epistemic/${kind}`, {
      method: "POST",
      body: JSON.stringify({
        record,
        project: project ?? this.defaultProject,
        source: source ?? this.defaultSource,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenPlanner epistemic write failed (${res.status}): ${text}`);
    }
    return res.json() as Promise<WriteResult>;
  }

  /**
   * Health check — returns true if the upstream is reachable.
   */
  async isHealthy(): Promise<boolean> {
    try {
      const res = await this.request("/health");
      return res.ok;
    } catch {
      return false;
    }
  }
}
