/**
 * Real-world fixture tests — run convert() against a saved HTML snapshot to
 * catch regressions from dependency updates.
 *
 * Fixtures are static files in test/fixtures/; they never require network access.
 */
import { assertMatch, assertStringIncludes } from "@std/assert";
import { convert } from "./mod.ts";

const denoV2Html = await Deno.readTextFile(
  new URL("test/fixtures/deno-blog-v2.html", import.meta.url),
);

Deno.test("fixture deno-blog-v2: extracts article title", () => {
  const { title } = convert(denoV2Html);
  assertStringIncludes(title ?? "", "Deno 2");
});

Deno.test("fixture deno-blog-v2: extracts description", () => {
  const { description } = convert(denoV2Html);
  assertStringIncludes(description ?? "", "Deno");
});

Deno.test("fixture deno-blog-v2: reader mode produces non-empty markdown", () => {
  const { markdown } = convert(denoV2Html, { frontmatter: false });
  assertStringIncludes(markdown, "Announcing Deno 2");
});

Deno.test("fixture deno-blog-v2: frontmatter includes title and date", () => {
  const { markdown } = convert(denoV2Html, {
    url: "https://deno.com/blog/v2.0",
  });
  assertStringIncludes(markdown, "---");
  assertStringIncludes(markdown, "Deno 2");
  assertStringIncludes(markdown, 'url: "https://deno.com/blog/v2.0"');
  assertMatch(markdown, /date: \d{4}-\d{2}-\d{2}/);
});

Deno.test("fixture deno-blog-v2: strip-links removes hrefs", () => {
  const { markdown } = convert(denoV2Html, {
    frontmatter: false,
    stripLinks: true,
  });
  assertMatch(markdown, /Announcing Deno 2/);
  // No markdown link syntax should remain
  const linkPattern = /\[.+?\]\(https?:\/\//;
  if (linkPattern.test(markdown)) {
    throw new Error("strip-links left markdown links in output");
  }
});
