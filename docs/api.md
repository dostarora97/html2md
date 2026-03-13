# API

`html2md` exports a single `convert()` function from `mod.ts`.

```ts
import { convert } from "@placeholder/html2md";

const { markdown, title } = convert(html, {
  url: "https://example.com",
  stripLinks: true,
});
```

The types (`ConvertOptions`, `ConvertResult`) and all option defaults are
documented in JSDoc directly on the source. Browse them with:

```bash
deno doc mod.ts
deno task doc:gen  # generates docs/api/ as browsable HTML
```
