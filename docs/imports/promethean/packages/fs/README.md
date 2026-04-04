<!-- READMEFLOW:BEGIN -->
# @promethean-os/fs



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/fs
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
- `lint`
- `lisp`
- `coverage`
- `test:markdown`
- `format`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_fs["@promethean-os/fs\n0.0.1"]
  _promethean_os_ds["@promethean-os/ds\n0.0.1"]
  _promethean_os_markdown["@promethean-os/markdown\n0.0.1"]
  _promethean_os_file_indexer_service["@promethean-os/file-indexer-service\n0.0.1"]
  _promethean_os_sentinel["@promethean-os/sentinel\n0.0.0"]
  _promethean_os_codepack["@promethean-os/codepack\n0.1.0"]
  _promethean_os_docops["@promethean-os/docops\n0.0.0"]
  _promethean_os_piper["@promethean-os/piper\n0.1.0"]
  _promethean_os_fs --> _promethean_os_ds
  _promethean_os_markdown --> _promethean_os_fs
  _promethean_os_file_indexer_service --> _promethean_os_fs
  _promethean_os_sentinel --> _promethean_os_fs
  _promethean_os_codepack --> _promethean_os_fs
  _promethean_os_docops --> _promethean_os_fs
  _promethean_os_piper --> _promethean_os_fs
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_fs focal;
```


<!-- READMEFLOW:END -->
