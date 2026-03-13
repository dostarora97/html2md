# Architecture

## Data flow

```
stdin (HTML)
     │
     ▼
cli.ts          parse flags (@std/cli) → read stdin → call convert()
     │
     ▼
mod.ts convert(html, opts)
     │
     ├─ linkedom.parseHTML()       build DOM (no Node/jsdom needed)
     ├─ extractMeta()              og:title → <title>, og:description → meta[name]
     ├─ Readability.parse()        extract article body  (reader=true, default)
     │  or querySelectorAll+remove strip noise tags     (reader=false, --full)
     ├─ TurndownService.turndown() HTML → Markdown
     └─ buildFrontmatter()         prepend YAML block    (frontmatter=true, default)
     │
     ▼
stdout (Markdown)
```

## Dependency choices

**`linkedom`** over jsdom — pure JS, no native bindings, works in Deno without
compilation. Its DOM API is compatible enough that Readability runs unchanged.
The `as unknown as Document` cast in `mod.ts` papers over the type mismatch; the
runtime shapes are compatible.

**`@mozilla/readability`** — the same library behind Firefox Reader View. Chosen
because it's battle-tested on the real web and has no opinion about the DOM
implementation it receives.

**`turndown`** — handles the edge cases of HTML→Markdown conversion (tables,
nested lists, code blocks) that naive regex approaches miss. Custom rules in
`buildTurndown()` extend it for strikethrough, image/link stripping, and noise
removal.

**`@std/cli` `parseArgs`** — Deno standard library arg parser. Declarative
config (`boolean`, `string`, `alias`, `default`, `negatable`) replaces
hand-rolled flag parsing.

## Why `convert()` is synchronous

All work happens on an in-memory DOM — no I/O. Fetching is the caller's
responsibility, which keeps the library composable and testable without mocking.
