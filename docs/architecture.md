# Architecture

How html2md works internally — the three dependencies, data flow, and key design
decisions.

## Overview

```
stdin (HTML)
     │
     ▼
┌────────────────────────────────────────────────────────┐
│  cli.ts                                                │
│  • reads stdin chunks → single UTF-8 string           │
│  • parses CLI flags                                    │
│  • calls convert(html, opts)                          │
│  • writes result.markdown to stdout                   │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│  mod.ts  convert(html, opts)                          │
│                                                        │
│  1. linkedom.parseHTML(html)                          │
│     └─ builds a DOM tree without Node/jsdom           │
│                                                        │
│  2. extractMeta(document)                             │
│     └─ reads og:title / <title>, og:description /    │
│        meta[name=description]                         │
│                                                        │
│  3a. if reader=true (default):                        │
│      Readability(document).parse()                    │
│      └─ returns { content: "<article HTML>", ... }   │
│                                                        │
│  3b. if reader=false:                                 │
│      remove script/style/nav/header/footer/aside      │
│      use document.body.innerHTML                      │
│                                                        │
│  4. TurndownService.turndown(contentHtml)             │
│     └─ converts cleaned HTML → Markdown              │
│                                                        │
│  5. buildFrontmatter(title, description, url)         │
│     └─ YAML block prepended if frontmatter=true       │
│                                                        │
│  6. return { markdown, title, description }           │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
              stdout (Markdown)
```

## The three dependencies

### 1. `linkedom` — DOM parsing

**Why not jsdom?** `jsdom` is the standard DOM implementation for Node but has a
heavyweight dependency tree and requires native bindings. `linkedom` is a
pure-JS, standards-compliant DOM that works natively in Deno with zero native
compilation.

`linkedom.parseHTML(html)` returns a `{ document }` object whose API is
compatible with the browser DOM, so Readability works unchanged.

### 2. `@mozilla/readability` — reader mode

Mozilla Readability is the same library used in Firefox's Reader View. It takes
a live DOM document and returns the article's main content as clean HTML,
stripping boilerplate (navigation, ads, sidebars, related articles).

The key call is:

```ts
const article = new Readability(document as unknown as Document).parse();
// article.content → clean article HTML
// article.title   → article title (we use meta tags instead)
```

The `as unknown as Document` cast is necessary because `linkedom`'s `Document`
type is not identical to the browser `Document` type — but their runtime shape
is compatible enough for Readability.

**When reader mode is off (`--full`):** we manually remove `script`, `style`,
`noscript`, `nav`, `header`, `footer`, `aside`, `iframe` from the DOM, then use
`document.body.innerHTML` directly.

### 3. `turndown` — HTML → Markdown

Turndown converts an HTML string to Markdown. We configure it with:

- `headingStyle: "atx"` → `# H1` not underline style
- `codeBlockStyle: "fenced"` → triple-backtick blocks
- `bulletListMarker: "-"` → dashes not asterisks
- `linkStyle: "inlined"` → `[text](url)` not reference style

We extend it with custom rules:

- `td.remove(...)` for `script`, `style`, `noscript`, `iframe`
- `td.addRule("stripImages", ...)` overrides the built-in `img` rule to output
  nothing (using `td.remove` for img doesn't work because the built-in rule
  takes precedence — `addRule` does)
- `td.addRule("plainLinks", ...)` replaces link content with just text
- `td.addRule("strikethrough", ...)` for `<del>`, `<s>`, `<strike>`

## Meta extraction priority

Titles: `og:title` → `<title>` → `""` Descriptions: `og:description` →
`meta[name=description]` → `""`

OG tags take priority because they are usually cleaner (no " | Site Name"
suffix) and more representative of the article content.

## Why `convert()` is synchronous

All three dependencies operate synchronously on an in-memory DOM. There is no
I/O inside `convert()`. Network fetching is deliberately left to the caller (or
to `curl` in the CLI case) — this keeps the library composable and testable
without mocking.

## Stdin handling in cli.ts

We accumulate `Uint8Array` chunks into an array, then merge and decode once at
the end:

```ts
const chunks: Uint8Array[] = [];
for await (const chunk of Deno.stdin.readable) chunks.push(chunk);
// merge + decode ...
```

This is more efficient than string concatenation for large pages and avoids
partial UTF-8 codepoints at chunk boundaries.
