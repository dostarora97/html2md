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

## Installation

```bash
# Global CLI (requires Deno)
deno install --global --allow-read --allow-env -n html2md jsr:@dostarora97/html2md/cli.ts

# As a library
deno add jsr:@dostarora97/html2md
```

## Library usage

```ts
import { convert } from "@dostarora97/html2md";

const html = await fetch("https://example.com").then((r) => r.text());
const { markdown, title } = convert(html, { url: "https://example.com" });
console.log(markdown);
```

## CLI usage

```bash
# Reader mode + frontmatter (defaults)
curl -s https://example.com | html2md --url https://example.com

# Clean text for inline LLM prompts
curl -s https://example.com | html2md --no-frontmatter --strip-links --strip-images

# Full page when Readability misses the content
curl -s https://app.example.com | html2md --full
```

## Features

- **Reader mode** — strips nav, header, footer, ads via Mozilla Readability
- **YAML frontmatter** — title, url, date, description ready for LLM context
- **Full fidelity** — tables, fenced code blocks, strikethrough preserved
- **Flags** — `--full`, `--no-frontmatter`, `--strip-images`, `--strip-links`
- **Pipe-friendly** — reads stdin, writes stdout, zero config
- **Library** — importable from Deno or Node (via JSR npm compat)

## Documentation

Full docs are in [`docs/`](docs/README.md). See
[contributing](docs/contributing.md) to set up locally.
