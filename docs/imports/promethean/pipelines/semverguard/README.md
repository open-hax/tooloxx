<!-- READMEFLOW:BEGIN -->
# @promethean-os/semverguard



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/semverguard
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `sv:01-snapshot`
- `sv:02-diff`
- `sv:03-plan`
- `sv:04-write`
- `sv:05-pr`
- `sv:all`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_semverguard["@promethean-os/semverguard\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_semverguard --> _promethean_os_utils
  _promethean_os_semverguard --> _promethean_os_level_cache
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_semverguard focal;
```


<!-- READMEFLOW:END -->
