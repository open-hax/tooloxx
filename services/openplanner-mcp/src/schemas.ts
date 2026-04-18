/**
 * Epistemic kernel schemas — Zod port of promptdb-core Malli definitions.
 *
 * These mirror the schemas in packages/promptdb-core/src/promptdb/core.cljc.
 * A schema-sync test should verify these match the Malli originals.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// Confidence interval
// ---------------------------------------------------------------------------

export const Confidence = z.number().min(0).max(1);

// ---------------------------------------------------------------------------
// Epistemic context roles
// ---------------------------------------------------------------------------

export const CtxRole = z.enum(["己", "汝", "彼", "世", "主"]);

// ---------------------------------------------------------------------------
// Primitive schemas
// ---------------------------------------------------------------------------

/**
 * A principal asserts a proposition is true.
 * LayerKind: actor
 */
export const Fact = z.object({
  ctx: CtxRole,
  claim: z.unknown(),
  src: z.unknown(),           // provenance: event-id, actor-id, URL, …
  p: Confidence,
  time: z.string().datetime(), // ISO 8601
});

/**
 * Something was sensed / observed (not yet validated).
 * LayerKind: event
 */
export const Obs = z.object({
  ctx: CtxRole,
  about: z.unknown(),         // what was sensed
  signal: z.unknown(),        // raw signal shape
  p: Confidence,
});

/**
 * A derived proposition produced by applying a contract to evidence.
 * LayerKind: contract-execution
 */
export const Inference = z.object({
  from: z.array(z.union([Fact, Obs])),
  rule: z.string(),           // contract-id that fired (keyword as string)
  actor: z.string(),          // who executed the contract (keyword as string)
  claim: z.unknown(),
  p: Confidence,
});

/**
 * The actor's signature that they did what they said.
 * LayerKind: receipt
 */
export const Attestation = z.object({
  actor: z.string(),           // keyword as string
  did: z.unknown(),
  run_id: z.string().uuid(),
  causedby: z.string().uuid().optional(),
  p: Confidence,
});

/**
 * The world's verdict on whether an inference/attestation held.
 * LayerKind: fulfillment
 */
export const Judgment = z.object({
  of: z.string().uuid(),
  verdict: z.enum(["held", "failed", "partial"]),
  auditor: z.string(),         // keyword as string
  p: Confidence,
});

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const EpistemicSchemaRegistry = {
  fact: Fact,
  obs: Obs,
  inference: Inference,
  attestation: Attestation,
  judgment: Judgment,
} as const;

export type EpistemicKind = keyof typeof EpistemicSchemaRegistry;

export type FactType = z.infer<typeof Fact>;
export type ObsType = z.infer<typeof Obs>;
export type InferenceType = z.infer<typeof Inference>;
export type AttestationType = z.infer<typeof Attestation>;
export type JudgmentType = z.infer<typeof Judgment>;

/**
 * Validate an epistemic record against its schema.
 * Returns the parsed value or throws a ZodError.
 */
export function validateEpistemic(kind: EpistemicKind, value: unknown) {
  const schema = EpistemicSchemaRegistry[kind];
  if (!schema) {
    throw new Error(`Unknown epistemic kind: ${kind}`);
  }
  return schema.parse(value);
}
