# @promethean-os/file-indexer

`@promethean-os/file-indexer` provides a high-level wrapper around
`@promethean-os/utils`'s `listFilesRec` helper. It adds callback hooks, optional
content reads, batching, and progress reporting so pipelines can scan large
workspaces without re-implementing traversal logic.

## Usage

```ts
import { scanFiles } from "@promethean-os/file-indexer";

await scanFiles({
  root: "/workspace/promethean/docs",
  exts: ["md", "mdx"],
  ignoreDirs: ["node_modules", "dist"],
  readContent: (filePath) => filePath.endsWith(".md"),
  batchSize: 25,
  onFile: async ({ path, content }) => {
    // run pipeline specific logic per file
  },
  onBatch: async (batch, progress) => {
    console.log(`Processed ${progress.processed}/${progress.total}`);
    // batch contains clones of the latest files, safe for async work
  },
  onProgress: ({ processed, total, percentage }) => {
    console.log(`${processed}/${total} (${(percentage * 100).toFixed(1)}%)`);
  },
});
```

### Options

- `exts`: filter extensions (dot prefix optional).
- `ignoreDirs`: directory names or relative paths to exclude.
- `readContent`: boolean or predicate to control when file text is loaded.
- `onFile`: async-safe callback invoked for each file.
- `onBatch` & `batchSize`: process files in grouped batches.
- `onProgress`: receive progress snapshots after each file.
- `collect`: set to `true` to include processed files in the returned result even
  when callbacks are supplied.

The function returns `{ total, processed, durationMs, files? }`. When neither
`onFile` nor `onBatch` is provided (or when `collect: true`), `files` contains
all processed entries, making it easy to reuse scan results downstream.

<!-- READMEFLOW:BEGIN -->
# @promethean-os/file-indexer



[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/file-indexer
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
  _promethean_os_file_indexer["@promethean-os/file-indexer\n0.0.1"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_codepack["@promethean-os/codepack\n0.1.0"]
  _promethean_os_pipeline_core["@promethean-os/pipeline-core\n0.1.0"]
  _promethean_os_docops["@promethean-os/docops\n0.0.0"]
  _promethean_os_symdocs["@promethean-os/symdocs\n0.1.0"]
  _promethean_os_file_indexer --> _promethean_os_utils
  _promethean_os_codepack --> _promethean_os_file_indexer
  _promethean_os_pipeline_core --> _promethean_os_file_indexer
  _promethean_os_docops --> _promethean_os_file_indexer
  _promethean_os_symdocs --> _promethean_os_file_indexer
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_file_indexer focal;
```


<!-- READMEFLOW:END -->
