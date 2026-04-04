# Hormuz Clock MCP Server

Multi-model thread assessment collector and deterministic clock reducer.

## Architecture

This follows the **model → structured claims → aggregation → deterministic clock** pattern:

1. **Collector** - Accepts assessment packets from multiple model backends
2. **Normalizer** - Validates packets against the `ThreadAssessmentPacket` schema
3. **Evidence Index** - Deduplicates sources, scores quality/recency
4. **Reducer** - Weighted median aggregation with disagreement scoring
5. **Audit Log** - Every submission and reduced output is logged

## Packet Schema

See `@workspace/thread-assessment` for the full packet format:

```typescript
{
  thread_id: string,
  timestamp_utc: string,
  model_id: string,
  sources: SourceCitation[],
  signal_scores: Record<string, SignalScore>,
  branch_assessment: BranchAssessment[],
  uncertainties: UncertaintyStatement[]
}
```

## Signal Scale

| Value | Label |
|-------|-------|
| 0 | normal |
| 1 | stressed |
| 2 | degraded |
| 3 | impaired |
| 4 | broken |

## MCP Tools

- `hormuz_submit_packet` - Submit an assessment packet
- `hormuz_get_reduced_state` - Get current reduced clock state
- `hormuz_list_submissions` - List all packets for current thread
- `hormuz_get_evidence_summary` - Get evidence index summary

## Environment

```bash
PORT=10001
PUBLIC_BASE_URL=https://your-render-app.onrender.com
ADMIN_AUTH_KEY=your-admin-key
DATABASE_URL=postgres://...
HORMUZ_THREAD_ID=hormuz
```

## License

GPL-3.0-or-later