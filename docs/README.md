# html2md

Convert HTML to Markdown from the command line or as a Deno/Node library. Built
for feeding web content to LLMs.

```bash
curl -s https://deno.com/blog/v2.0 | html2md --url https://deno.com/blog/v2.0
```

Output:

```markdown
---
title: "Announcing Deno 2 | Deno"
url: "https://deno.com/blog/v2.0"
date: 2026-03-13
description: "Our next major version of Deno..."
---

## Announcing Deno 2

The web is humanity's largest software platform...
```

## Why this exists

The best way to give an LLM context about a webpage is clean, structured text —
not raw HTML full of `<nav>`, `<script>`, ads, and boilerplate. `html2md` uses
[Mozilla Readability](https://github.com/mozilla/readability) (the same library
behind Firefox Reader View) to extract just the article body, then converts it
to Markdown with full support for tables, code blocks, images, and
strikethrough.

## Features

- **Reader mode** — strips nav, header, footer, ads via Mozilla Readability
- **YAML frontmatter** — title, url, date, description ready for LLM context
- **Full fidelity** — tables, fenced code blocks, strikethrough preserved
- **Flags** — `--full`, `--no-frontmatter`, `--strip-images`, `--strip-links`
- **Pipe-friendly** — reads stdin, writes stdout, zero config
- **Library** — importable from Deno or Node (via JSR npm compat)

## Installation

```bash
# Global CLI (requires Deno)
deno install --global --allow-read --allow-env -n html2md https://jsr.io/@placeholder/html2md/cli.ts

# Or clone + bootstrap (installs Deno if needed, hooks, and the CLI)
git clone <repo-url> html2md && cd html2md
./scripts/bootstrap.sh
```

## Quick usage

```bash
# Standard: reader mode + frontmatter
curl -s https://example.com | html2md

# With source URL in frontmatter
curl -s https://example.com | html2md --url https://example.com

# Full page (no reader extraction)
curl -s https://example.com | html2md --full

# Clean text for inline LLM prompts
curl -s https://example.com | html2md --no-frontmatter --strip-links --strip-images

# Save to file
curl -s https://docs.deno.com | html2md --url https://docs.deno.com > context.md
```

## Documentation

| File                               | Contents                                            |
| ---------------------------------- | --------------------------------------------------- |
| [cli.md](cli.md)                   | All CLI flags, examples, exit codes                 |
| [api.md](api.md)                   | `convert()` function, all options, TypeScript types |
| [architecture.md](architecture.md) | How the three dependencies fit together, data flow  |
| [contributing.md](contributing.md) | Setup, workflow, how to add a new flag end-to-end   |
| [publishing.md](publishing.md)     | JSR publishing, versioning, the `/release` skill    |
