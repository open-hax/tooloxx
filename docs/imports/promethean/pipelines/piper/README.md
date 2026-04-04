# @promethean-os/piper

Piper is a lightweight pipeline runner. It reads a `pipelines.json` file and executes the steps it defines.

## Dev UI

A minimal Fastify server is included to inspect pipelines and trigger steps from the browser.

```bash
pnpm --filter @promethean-os/piper dev-ui -- --config pipelines.json
```

Then open [http://localhost:3939](http://localhost:3939) to run individual steps. The UI lists pipelines and exposes buttons for each step while streaming logs back to the page.

<!-- READMEFLOW:BEGIN -->
# @promethean-os/piper



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/piper
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `typecheck`
- `test`
- `coverage`
- `clean`
- `prepack`
- `dev-ui`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_piper["@promethean-os/piper\n0.1.0"]
  _promethean_os_fs["@promethean-os/fs\n0.0.1"]
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_test_utils["@promethean-os/test-utils\n0.0.1"]
  _promethean_os_piper --> _promethean_os_fs
  _promethean_os_piper --> _promethean_os_level_cache
  _promethean_os_piper --> _promethean_os_utils
  _promethean_os_piper --> _promethean_os_test_utils
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_piper focal;
```


<!-- READMEFLOW:END -->
