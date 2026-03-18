# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CLI integration tests (`cli_test.ts`) covering all flags, empty-stdin exit
  code, and `--help`
- Real-world HTML fixture tests (`fixture_test.ts`) using a saved snapshot of
  the Deno 2.0 blog post to catch regressions from dependency updates

### Fixed

- YAML frontmatter: newlines in `title`/`description` are now collapsed to
  spaces; double-quotes are correctly escaped
- Added test coverage for Readability null-result fallback path

## [0.1.2] - 2026-03-18

### Fixed

- HTML fragments (no `<html>`/`<body>` wrapper, e.g. Confluence REST API
  responses) no longer crash Readability with a null-dereference error on
  `tagName`

### Changed

- Refactored internals into `src/` modules (`extract`, `markdown`,
  `frontmatter`)

## [0.1.1] - 2026-03-13

### Added

- Root `README.md` for JSR package page
- Module doc on `mod.ts` entrypoint

### Fixed

- `release-drafter.yml` invalid `_template` key

## [0.1.0] - 2026-03-13

### Added

- `convert(html, opts)` library function exportable from `mod.ts`
- CLI (`cli.ts`) reading from stdin, writing markdown to stdout
- Reader mode via Mozilla Readability (default) — strips nav/header/footer/ads
- YAML frontmatter: title, url, date, description
- `--full` flag: convert entire page DOM without reader extraction
- `--no-frontmatter` flag: omit YAML frontmatter block
- `--strip-images` flag: remove all images from output
- `--strip-links` flag: convert hyperlinks to plain text
- `--url <url>` flag: embed source URL in frontmatter
- `--help` / `-h` flag: print usage
- Fenced code blocks, markdown tables, strikethrough (`~~text~~`) support
- 14 unit tests (`mod_test.ts`)
- GitHub Actions CI (lint, fmt, typecheck, test on push/PR)
- GitHub Actions publish workflow (JSR publish on version tag push)
