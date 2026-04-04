<!-- READMEFLOW:BEGIN -->
# @promethean-os/codepack



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/codepack
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `test`
- `lint`
- `code:01-extract`
- `code:02-embed`
- `code:03-cluster`
- `code:04-name`
- `code:05-materialize`
- `code:all`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_codepack["@promethean-os/codepack\n0.1.0"]
  _promethean_os_fs["@promethean-os/fs\n0.0.1"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_pipeline_core["@promethean-os/pipeline-core\n0.1.0"]
  _promethean_os_file_indexer["@promethean-os/file-indexer\n0.0.1"]
  _promethean_os_codepack --> _promethean_os_fs
  _promethean_os_codepack --> _promethean_os_utils
  _promethean_os_codepack --> _promethean_os_level_cache
  _promethean_os_codepack --> _promethean_os_pipeline_core
  _promethean_os_codepack --> _promethean_os_file_indexer
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_codepack focal;
```


<!-- READMEFLOW:END -->
