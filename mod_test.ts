import { assertEquals, assertMatch, assertStringIncludes } from "@std/assert";
import { convert } from "./mod.ts";

const ARTICLE_HTML = `
<html>
  <head>
    <title>My Test Article</title>
    <meta name="description" content="A short description.">
    <meta property="og:title" content="OG Title Override">
  </head>
  <body>
    <nav>Skip this nav</nav>
    <header>Skip this header</header>
    <article>
      <h1>Main Heading</h1>
      <p>This is <strong>bold</strong> and <em>italic</em> text.</p>
      <pre><code class="language-ts">const x: number = 1;</code></pre>
      <table>
        <tr><th>Name</th><th>Value</th></tr>
        <tr><td>foo</td><td>bar</td></tr>
      </table>
      <img src="photo.jpg" alt="A photo">
      <p>Visit <a href="https://example.com">example.com</a> for more.</p>
      <del>deleted text</del>
    </article>
    <footer>Skip this footer</footer>
  </body>
</html>
`;

Deno.test("frontmatter: includes title and date by default", () => {
  const { markdown } = convert(ARTICLE_HTML, {
    url: "https://example.com/page",
  });
  assertStringIncludes(markdown, "---");
  assertStringIncludes(markdown, 'url: "https://example.com/page"');
  assertMatch(markdown, /date: \d{4}-\d{2}-\d{2}/);
});

Deno.test("frontmatter: og:title takes precedence over <title>", () => {
  const { markdown } = convert(ARTICLE_HTML);
  assertStringIncludes(markdown, 'title: "OG Title Override"');
});

Deno.test("frontmatter: description from meta tag", () => {
  const { markdown } = convert(ARTICLE_HTML);
  assertStringIncludes(markdown, "A short description.");
});

Deno.test("frontmatter: omitted with no-frontmatter option", () => {
  const { markdown } = convert(ARTICLE_HTML, { frontmatter: false });
  assertEquals(markdown.startsWith("---"), false);
});

Deno.test("reader mode: strips nav, header, footer", () => {
  const { markdown } = convert(ARTICLE_HTML, { frontmatter: false });
  assertEquals(markdown.includes("Skip this nav"), false);
  assertEquals(markdown.includes("Skip this header"), false);
  assertEquals(markdown.includes("Skip this footer"), false);
});

Deno.test("reader mode: keeps article content", () => {
  const { markdown } = convert(ARTICLE_HTML, { frontmatter: false });
  assertStringIncludes(markdown, "Main Heading");
  assertStringIncludes(markdown, "bold");
});

Deno.test("code blocks: preserved as fenced blocks", () => {
  const { markdown } = convert(ARTICLE_HTML, { frontmatter: false });
  assertStringIncludes(markdown, "```");
  assertStringIncludes(markdown, "const x");
});

Deno.test("tables: converted to markdown tables", () => {
  const { markdown } = convert(ARTICLE_HTML, { frontmatter: false });
  assertStringIncludes(markdown, "Name");
  assertStringIncludes(markdown, "foo");
});

Deno.test("images: kept by default", () => {
  // Reader mode may strip figures, but --full should keep images
  const { markdown } = convert(ARTICLE_HTML, {
    frontmatter: false,
    reader: false,
  });
  assertStringIncludes(markdown, "photo.jpg");
});

Deno.test("stripImages: removes images when flag set", () => {
  const { markdown } = convert(ARTICLE_HTML, {
    frontmatter: false,
    reader: false,
    stripImages: true,
  });
  assertEquals(markdown.includes("photo.jpg"), false);
});

Deno.test("stripLinks: converts links to plain text", () => {
  const { markdown } = convert(ARTICLE_HTML, {
    frontmatter: false,
    stripLinks: true,
  });
  assertEquals(markdown.includes("https://example.com"), false);
  assertStringIncludes(markdown, "example.com");
});

Deno.test("strikethrough: rendered as ~~text~~", () => {
  const { markdown } = convert(ARTICLE_HTML, { frontmatter: false });
  assertStringIncludes(markdown, "~~deleted text~~");
});

Deno.test("full mode: keeps body content without reader extraction", () => {
  const { markdown } = convert(ARTICLE_HTML, {
    frontmatter: false,
    reader: false,
  });
  assertStringIncludes(markdown, "Main Heading");
});

Deno.test("convert: returns title and description in result", () => {
  const result = convert(ARTICLE_HTML);
  assertEquals(result.title, "OG Title Override");
  assertEquals(result.description, "A short description.");
});
