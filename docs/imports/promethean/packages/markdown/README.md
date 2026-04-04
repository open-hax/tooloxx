<!-- READMEFLOW:BEGIN -->
# @promethean-os/markdown



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/markdown
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
  _promethean_os_markdown["@promethean-os/markdown\n0.0.1"]
  _promethean_os_fs["@promethean-os/fs\n0.0.1"]
  _promethean_os_boardrev["@promethean-os/boardrev\n0.1.0"]
  _promethean_os_docops["@promethean-os/docops\n0.0.0"]
  _promethean_os_kanban["@promethean-os/kanban\n0.2.0"]
  _promethean_os_markdown --> _promethean_os_fs
  _promethean_os_boardrev --> _promethean_os_markdown
  _promethean_os_docops --> _promethean_os_markdown
  _promethean_os_kanban --> _promethean_os_markdown
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_markdown focal;
```


<!-- READMEFLOW:END -->
