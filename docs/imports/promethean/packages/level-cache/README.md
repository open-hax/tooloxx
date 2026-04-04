
# packages/level-cache/README.md

# @promethean-os/level-cache

A tiny, embedded, **functional-style** cache on top of `level`:
- **No server**, no daemon.
- **TTL** via per-record expiry.
- **Lazy eviction** + explicit `sweepExpired()`.
- **Namespaces** without extra deps.
- Pure helpers; no hidden stateful loops.

## Install

```bash
pnpm -r add @promethean-os/level-cache
````

## Use

```typescript
import { openLevelCache } from "@promethean-os/level-cache";

const cache = await openLevelCache<{ foo: string }>({
  path: ".cache/level-cache",
  defaultTtlMs: 60_000,
  namespace: "docops"
});

await cache.set("k1", { foo: "bar" }, { ttlMs: 5_000 });
console.log(await cache.get("k1")); // { foo: 'bar' }

const userNs = cache.withNamespace("users");
await userNs.set("u:123", { foo: "baz" });

for await (const [k, v] of userNs.entries()) {
  console.log(k, v);
}

const removed = await cache.sweepExpired();
console.log({ removed });

await cache.close();
```

## Notes

* Expired keys are removed lazily on `get()` and during `entries()`; call `sweepExpired()` to clean proactively.
* Keys are encoded as `${namespace}␟${key}`; change safely by forking.
* Values default to `json` encoding via `level`.



## why this shape (systems-design POV)

- **No mutation:** APIs return new namespaced “views” instead of mutating global state.
- **No background timers:** predictable failure modes; you decide when to sweep.
- **No sublevel dependency:** zero extra moving parts; straight prefixing.
- **TTL as data, not behavior:** deletions are idempotent and safe.

<!-- READMEFLOW:BEGIN -->
# @promethean-os/level-cache



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/level-cache
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `clean`
- `typecheck`
- `test`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_test_utils["@promethean-os/test-utils\n0.0.1"]
  _promethean_os_boardrev["@promethean-os/boardrev\n0.1.0"]
  _promethean_os_codemods["@promethean-os/codemods\n0.1.0"]
  _promethean_os_codepack["@promethean-os/codepack\n0.1.0"]
  _promethean_os_pipeline_core["@promethean-os/pipeline-core\n0.1.0"]
  _promethean_os_piper["@promethean-os/piper\n0.1.0"]
  _promethean_os_readmeflow["@promethean-os/readmeflow\n0.1.0"]
  _promethean_os_semverguard["@promethean-os/semverguard\n0.1.0"]
  _promethean_os_simtasks["@promethean-os/simtasks\n0.1.0"]
  _promethean_os_sonarflow["@promethean-os/sonarflow\n0.1.0"]
  _promethean_os_symdocs["@promethean-os/symdocs\n0.1.0"]
  _promethean_os_level_cache --> _promethean_os_utils
  _promethean_os_level_cache --> _promethean_os_test_utils
  _promethean_os_boardrev --> _promethean_os_level_cache
  _promethean_os_codemods --> _promethean_os_level_cache
  _promethean_os_codepack --> _promethean_os_level_cache
  _promethean_os_pipeline_core --> _promethean_os_level_cache
  _promethean_os_piper --> _promethean_os_level_cache
  _promethean_os_readmeflow --> _promethean_os_level_cache
  _promethean_os_semverguard --> _promethean_os_level_cache
  _promethean_os_simtasks --> _promethean_os_level_cache
  _promethean_os_sonarflow --> _promethean_os_level_cache
  _promethean_os_symdocs --> _promethean_os_level_cache
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_level_cache focal;
```


<!-- READMEFLOW:END -->
