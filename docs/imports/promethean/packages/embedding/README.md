<!-- READMEFLOW:BEGIN -->
# @promethean-os/embedding



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/embedding
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
- `coverage`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_embedding["@promethean-os/embedding\n0.0.1"]
  _promethean_os_platform["@promethean-os/platform\n0.0.1"]
  _promethean_os_discord["@promethean-os/discord\n0.0.1"]
  _promethean_os_migrations["@promethean-os/migrations\n0.0.1"]
  _promethean_os_persistence["@promethean-os/persistence\n0.0.1"]
  _promethean_os_embedding --> _promethean_os_platform
  _promethean_os_discord --> _promethean_os_embedding
  _promethean_os_migrations --> _promethean_os_embedding
  _promethean_os_persistence --> _promethean_os_embedding
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_embedding focal;
```


<!-- READMEFLOW:END -->
