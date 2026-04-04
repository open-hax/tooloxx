<!-- READMEFLOW:BEGIN -->
# @promethean-os/cookbookflow



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/cookbookflow
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `cb:01-scan`
- `cb:02-embed-classify`
- `cb:03-group`
- `cb:04-plan`
- `cb:05-materialize`
- `cb:06-exec`
- `cb:07-verify`
- `cb:08-report`
- `cb:all`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_cookbookflow["@promethean-os/cookbookflow\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_cookbookflow --> _promethean_os_utils
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_cookbookflow focal;
```


<!-- READMEFLOW:END -->
