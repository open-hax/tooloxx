<!-- READMEFLOW:BEGIN -->
# @promethean-os/simtasks



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/simtasks
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `test`
- `sim:01-scan`
- `sim:02-embed`
- `sim:03-cluster`
- `sim:04-plan`
- `sim:05-write`
- `sim:all`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_simtasks["@promethean-os/simtasks\n0.1.0"]
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_pipeline_core["@promethean-os/pipeline-core\n0.1.0"]
  _promethean_os_file_indexer_service["@promethean-os/file-indexer-service\n0.0.1"]
  _promethean_os_simtasks --> _promethean_os_level_cache
  _promethean_os_simtasks --> _promethean_os_utils
  _promethean_os_simtasks --> _promethean_os_pipeline_core
  _promethean_os_simtasks --> _promethean_os_file_indexer_service
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_simtasks focal;
```


<!-- READMEFLOW:END -->
