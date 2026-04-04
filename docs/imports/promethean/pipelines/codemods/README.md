<!-- READMEFLOW:BEGIN -->
# @promethean-os/codemods



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/codemods
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `mods:01-spec`
- `mods:02-generate`
- `mods:03-dry-run`
- `mods:03-apply`
- `mods:all`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_codemods["@promethean-os/codemods\n0.1.0"]
  _promethean_os_level_cache["@promethean-os/level-cache\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_codemods --> _promethean_os_level_cache
  _promethean_os_codemods --> _promethean_os_utils
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_codemods focal;
```


<!-- READMEFLOW:END -->
