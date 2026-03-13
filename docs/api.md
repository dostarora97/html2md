# API reference

`html2md` exports a single function from `mod.ts`. Import it from JSR:

```ts
import { convert } from "jsr:@placeholder/html2md";
// or, after deno add @placeholder/html2md:
import { convert } from "@placeholder/html2md";
```

---

## `convert(html, opts?)`

Converts an HTML string to Markdown.

### Parameters

| Parameter | Type             | Description                                      |
| --------- | ---------------- | ------------------------------------------------ |
| `html`    | `string`         | Raw HTML to convert                              |
| `opts`    | `ConvertOptions` | Optional. All fields default as described below. |

### Returns `ConvertResult`

| Field         | Type                  | Description                                                       |
| ------------- | --------------------- | ----------------------------------------------------------------- |
| `markdown`    | `string`              | The converted Markdown, including frontmatter if enabled          |
| `title`       | `string \| undefined` | Extracted from `og:title` or `<title>`. `undefined` if not found. |
| `description` | `string \| undefined` | Extracted from `og:description` or `meta[name=description]`.      |

---

## `ConvertOptions`

All fields are optional.

### `reader`

```ts
reader?: boolean  // default: true
```

Use Mozilla Readability to extract the main article body before converting.
Strips `<nav>`, `<header>`, `<footer>`, `<aside>`, and other boilerplate.

Set to `false` to convert the entire page DOM. Useful for SPAs or pages where
Readability fails to detect the article.

### `frontmatter`

```ts
frontmatter?: boolean  // default: true
```

Prepend a YAML frontmatter block with `title`, `url`, `date`, `description`.

### `url`

```ts
url?: string  // default: undefined
```

The canonical URL of the source page. Added to frontmatter as `url:`. Does not
trigger any network request — purely metadata.

### `stripImages`

```ts
stripImages?: boolean  // default: false
```

Remove all `<img>`, `<picture>`, and `<figure>` elements from the output.

### `stripLinks`

```ts
stripLinks?: boolean  // default: false
```

Convert hyperlinks to plain text, discarding the `href` attribute.

---

## Examples

### Defaults — reader mode + frontmatter

```ts
import { convert } from "@placeholder/html2md";

const html = await fetch("https://deno.com/blog/v2.0").then((r) => r.text());
const { markdown, title } = convert(html, {
  url: "https://deno.com/blog/v2.0",
});

console.log(title); // "Announcing Deno 2 | Deno"
console.log(markdown); // "---\ntitle: ...\n---\n\n## Announcing Deno 2\n..."
```

### Library usage without frontmatter

```ts
const { markdown } = convert(html, { frontmatter: false });
```

### Full page conversion

```ts
const { markdown } = convert(html, { reader: false });
```

### Strip everything for dense text input to an LLM

```ts
const { markdown } = convert(html, {
  frontmatter: false,
  stripImages: true,
  stripLinks: true,
});
```

### Check extraction results

```ts
const result = convert(html);
if (!result.title) {
  console.warn("No title found — page may not have meta tags");
}
```

---

## TypeScript types

```ts
export interface ConvertOptions {
  reader?: boolean;
  frontmatter?: boolean;
  url?: string;
  stripImages?: boolean;
  stripLinks?: boolean;
}

export interface ConvertResult {
  markdown: string;
  title?: string;
  description?: string;
}

export function convert(html: string, opts?: ConvertOptions): ConvertResult;
```

Full JSDoc is available via `deno doc mod.ts` or `deno task doc:gen`.
