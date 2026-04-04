<!-- READMEFLOW:BEGIN -->
# @promethean-os/logger

Structured logging package for Promethean with Winston

[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/logger
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `test`
- `test:unit`
- `clean`
- `typecheck`
- `lint`
- `dev`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_logger["@promethean-os/logger\n0.1.0"]
  _promethean_os_persistence["@promethean-os/persistence\n0.0.1"]
  _promethean_os_sentinel["@promethean-os/sentinel\n0.0.0"]
  _promethean_os_boardrev["@promethean-os/boardrev\n0.1.0"]
  _promethean_os_sonarflow["@promethean-os/sonarflow\n0.1.0"]
  _promethean_os_kanban["@promethean-os/kanban\n0.2.0"]
  _promethean_os_persistence --> _promethean_os_logger
  _promethean_os_sentinel --> _promethean_os_logger
  _promethean_os_boardrev --> _promethean_os_logger
  _promethean_os_sonarflow --> _promethean_os_logger
  _promethean_os_kanban --> _promethean_os_logger
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_logger focal;
```


<!-- READMEFLOW:END -->
