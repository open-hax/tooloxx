<!-- READMEFLOW:BEGIN -->
# @promethean-os/testgap



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/testgap
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `tg:01-scan-exports`
- `tg:02-read-coverage`
- `tg:03-map-gaps`
- `tg:04-cookbook-cross`
- `tg:05-plan`
- `tg:06-write`
- `tg:07-report`
- `tg:08-gate`
- `tg:all`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_testgap["@promethean-os/testgap\n0.1.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_testgap --> _promethean_os_utils
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_testgap focal;
```


<!-- READMEFLOW:END -->
