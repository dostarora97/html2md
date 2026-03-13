# CLI

`html2md` reads stdin, writes stdout. Run `html2md --help` for the full flag
reference.

## Common patterns

```bash
# Reader mode + frontmatter (defaults)
curl -s https://example.com | html2md --url https://example.com

# Clean text for inline LLM prompts
curl -s https://example.com | html2md --no-frontmatter --strip-links --strip-images

# Full page when Readability misses the content (SPAs, dashboards)
curl -s https://app.example.com | html2md --full

# Save multiple pages into one context file
for url in https://docs.deno.com/runtime/ https://docs.deno.com/runtime/fundamentals/; do
  curl -s "$url" | html2md --url "$url"
done > context.md
```

## Frontmatter

When enabled (default), output opens with a YAML block:

```yaml
---
title: "..."          # og:title, falling back to <title>
url: "..."            # only if --url was passed
date: YYYY-MM-DD      # today
description: "..."    # og:description or meta[name=description], if found
---
```

## Exit codes

| Code | Meaning                    |
| ---- | -------------------------- |
| `0`  | Success                    |
| `1`  | No input received on stdin |
