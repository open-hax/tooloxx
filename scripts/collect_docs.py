#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

TOOLOXX_ROOT = Path(__file__).resolve().parent.parent
DEVEL_ROOT = TOOLOXX_ROOT.parent.parent.parent
PROMETHEAN_ROOT = DEVEL_ROOT / "orgs" / "octave-commons" / "promethean"
IMPORT_ROOT = TOOLOXX_ROOT / "docs" / "imports"

EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "coverage",
    ".next",
    ".nx",
    ".scannerwork",
    ".cpcache",
    ".shadow-cljs",
    ".serena",
    ".pytest_cache",
    "__pycache__",
    ".ημ",
    ".Π",
}
DOC_SUFFIXES = {".md", ".mdx", ".org", ".txt", ".adoc", ".rst"}
PROMETHEAN_TOPLEVEL_DOCS = {
    "AGENTS.md",
    "README.md",
    "CHANGELOG.md",
    "HUMANS.md",
    "MANIFESTO.md",
    "graph.md",
    "spacekeys.md",
    "LICENSE.txt",
}


@dataclass
class CopyStats:
    files: int = 0
    dirs: int = 0


def reset_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def should_skip_dir(path: Path) -> bool:
    return path.name in EXCLUDED_DIRS


def copy_file(src: Path, dst: Path, stats: CopyStats) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    stats.files += 1


def copy_tree(src: Path, dst: Path, stats: CopyStats) -> None:
    if not src.exists():
        return
    for path in src.rglob("*"):
        rel = path.relative_to(src)
        if any(part in EXCLUDED_DIRS for part in rel.parts):
            continue
        target = dst / rel
        if path.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            stats.dirs += 1
        elif path.is_file():
            copy_file(path, target, stats)


def copy_promethean_docs(src_root: Path, dst_root: Path, stats: CopyStats) -> None:
    for name in sorted(PROMETHEAN_TOPLEVEL_DOCS):
        src = src_root / name
        if src.is_file():
            copy_file(src, dst_root / name, stats)

    for dirname in ("docs", "spec", "changelog.d"):
        src = src_root / dirname
        if src.exists():
            copy_tree(src, dst_root / dirname, stats)

    for path in src_root.rglob("*"):
        rel = path.relative_to(src_root)
        if any(part in EXCLUDED_DIRS for part in rel.parts):
            continue
        if not path.is_file():
            continue
        if rel.parts and rel.parts[0] in {"docs", "spec", "changelog.d"}:
            continue
        if path.suffix.lower() not in DOC_SUFFIXES:
            continue
        copy_file(path, dst_root / rel, stats)


def main() -> None:
    devel_dest = IMPORT_ROOT / "devel-root"
    promethean_dest = IMPORT_ROOT / "promethean"
    reset_dir(devel_dest)
    reset_dir(promethean_dest)

    devel_stats = CopyStats()
    promethean_stats = CopyStats()

    for filename in ("AGENTS.md", "README.md"):
        src = DEVEL_ROOT / filename
        if src.is_file():
            copy_file(src, devel_dest / filename, devel_stats)

    for dirname in ("docs", "spec", "specs"):
        src = DEVEL_ROOT / dirname
        if src.exists():
            copy_tree(src, devel_dest / dirname, devel_stats)

    copy_promethean_docs(PROMETHEAN_ROOT, promethean_dest, promethean_stats)

    manifest = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "tooloxxRoot": str(TOOLOXX_ROOT),
        "sources": {
            "develRoot": str(DEVEL_ROOT),
            "prometheanRoot": str(PROMETHEAN_ROOT),
        },
        "excludedDirs": sorted(EXCLUDED_DIRS),
        "imports": {
            "devel-root": {
                "destination": str(devel_dest.relative_to(TOOLOXX_ROOT)),
                "files": devel_stats.files,
                "dirs": devel_stats.dirs,
                "surfaces": ["AGENTS.md", "README.md", "docs/", "spec/", "specs/"],
            },
            "promethean": {
                "destination": str(promethean_dest.relative_to(TOOLOXX_ROOT)),
                "files": promethean_stats.files,
                "dirs": promethean_stats.dirs,
                "surfaces": [
                    "top-level doc files",
                    "docs/",
                    "spec/",
                    "changelog.d/",
                    "repo-wide markdown/org/txt/adoc/rst docs",
                ],
            },
        },
    }
    manifest_path = IMPORT_ROOT / "MANIFEST.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
