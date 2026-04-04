<!-- READMEFLOW:BEGIN -->
# @promethean-os/discord



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/discord
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
- `format`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_discord["@promethean-os/discord\n0.0.1"]
  _promethean_os_pantheon["@promethean-os/pantheon\n0.1.0"]
  _promethean_os_effects["@promethean-os/effects\n0.0.1"]
  _promethean_os_embedding["@promethean-os/embedding\n0.0.1"]
  _promethean_os_migrations["@promethean-os/migrations\n0.0.1"]
  _promethean_os_persistence["@promethean-os/persistence\n0.0.1"]
  _promethean_os_platform["@promethean-os/platform\n0.0.1"]
  _promethean_os_providers["@promethean-os/providers\n0.0.1"]
  _promethean_os_security["@promethean-os/security\n0.0.1"]
  _promethean_os_mcp["@promethean-os/mcp\n0.1.0"]
  _promethean_os_discord --> _promethean_os_pantheon
  _promethean_os_discord --> _promethean_os_effects
  _promethean_os_discord --> _promethean_os_embedding
  _promethean_os_discord --> _promethean_os_migrations
  _promethean_os_discord --> _promethean_os_persistence
  _promethean_os_discord --> _promethean_os_platform
  _promethean_os_discord --> _promethean_os_providers
  _promethean_os_discord --> _promethean_os_security
  _promethean_os_mcp --> _promethean_os_discord
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_discord focal;
```


<!-- READMEFLOW:END -->
