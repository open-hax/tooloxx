<!-- READMEFLOW:BEGIN -->
# @promethean-os/readmeflow



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/readmeflow
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `test`
- `typecheck`
- `clean`
- `coverage`
- `lint`
- `format`
- `rm:01-scan`
- `rm:02-outline`
- `rm:03-write`
- `rm:04-verify`
- `rm:all`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_readmeflow["@promethean-os/readmeflow\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_readmeflow --> _promethean_os_utils
  _promethean_os_readmeflow --> _promethean_os_level_cache
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_readmeflow focal;
```


<!-- READMEFLOW:END -->
