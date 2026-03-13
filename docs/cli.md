# CLI reference

`html2md` reads HTML from **stdin** and writes Markdown to **stdout**. It is
designed for piping: `curl ... | html2md [options] > output.md`.

## Synopsis

```
html2md [options]
```

## Options

| Flag               | Default | Description                                                                                                                         |
| ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `--url <url>`      | —       | Source URL. Embedded in frontmatter under `url:`. Does not fetch anything.                                                          |
| `--full`           | off     | Convert the entire page DOM instead of extracting the article body with Readability. Use for SPAs or pages where reader mode fails. |
| `--no-frontmatter` | off     | Omit the YAML frontmatter block entirely.                                                                                           |
| `--strip-images`   | off     | Remove all `<img>`, `<picture>`, and `<figure>` elements.                                                                           |
| `--strip-links`    | off     | Convert links to plain text (discard `href`).                                                                                       |
| `-h`, `--help`     | —       | Print usage and exit.                                                                                                               |

## Exit codes

| Code | Meaning                    |
| ---- | -------------------------- |
| `0`  | Success                    |
| `1`  | No input received on stdin |

## Examples

### Basic — reader mode + frontmatter

```bash
curl -s https://deno.com/blog/v2.0 | html2md --url https://deno.com/blog/v2.0
```

Output starts with:

```markdown
---
title: "Announcing Deno 2 | Deno"
url: "https://deno.com/blog/v2.0"
date: 2026-03-13
description: "Our next major version of Deno..."
---

## Announcing Deno 2

...
```

### Save a doc page for LLM context

```bash
curl -s https://docs.deno.com/runtime/ \
  | html2md --url https://docs.deno.com/runtime/ \
  > deno-runtime.md
```

### Pipe into a prompt

```bash
CONTENT=$(curl -s https://example.com | html2md --no-frontmatter --strip-links)
echo "Summarise this: $CONTENT" | llm
```

### Convert a local file

```bash
cat page.html | html2md --no-frontmatter
```

### Full page (no reader extraction)

Useful when Readability fails to identify the main content (SPAs, dashboards):

```bash
curl -s https://app.example.com/dashboard | html2md --full
```

### Strip everything for dense text

```bash
curl -s https://example.com \
  | html2md --no-frontmatter --strip-images --strip-links
```

### Multiple pages into one file

```bash
for url in \
  https://docs.deno.com/runtime/ \
  https://docs.deno.com/runtime/fundamentals/; do
  curl -s "$url" | html2md --url "$url"
  echo ""
done > deno-docs.md
```

## Frontmatter format

When `--no-frontmatter` is not set, the output begins with:

```yaml
---
title: "<og:title or <title>>"
url: "<value of --url flag>"     # only if --url was passed
date: YYYY-MM-DD                 # today's date
description: "<meta description>" # only if found
---
```

All values are sanitised (double-quotes escaped). The block is always valid
YAML.
