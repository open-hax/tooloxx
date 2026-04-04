<!-- READMEFLOW:BEGIN -->
# @promethean-os/boardrev



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/boardrev
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `br:01-fm`
- `br:02-prompts`
- `br:03-index`
- `br:03-index-incremental`
- `br:04-match`
- `br:04-enhanced`
- `br:05-eval`
- `br:06-report`
- `br:07-wip`
- `br:all`
- `br:all-enhanced`
- `monitor:start`
- `monitor:stop`
- `monitor:status`
- `monitor:trigger`
- `watch:demo`
- `schedule:demo`
- `test`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_boardrev["@promethean-os/boardrev\n0.1.0"]
  _promethean_os_kanban["@promethean-os/kanban\n0.2.0"]
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_logger["@promethean-os/logger\n0.1.0"]
  _promethean_os_markdown["@promethean-os/markdown\n0.0.1"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_boardrev --> _promethean_os_kanban
  _promethean_os_boardrev --> _promethean_os_level_cache
  _promethean_os_boardrev --> _promethean_os_logger
  _promethean_os_boardrev --> _promethean_os_markdown
  _promethean_os_boardrev --> _promethean_os_utils
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_boardrev focal;
```


<!-- READMEFLOW:END -->
