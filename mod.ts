import { extractContent, extractMeta, parseDocument } from "./src/extract.ts";
import { buildTurndown } from "./src/markdown.ts";
import { buildFrontmatter } from "./src/frontmatter.ts";

/**
 * Options controlling how HTML is converted to Markdown.
 *
 * All fields are optional. Defaults are optimised for feeding web content
 * to LLMs: reader-mode extraction is on, frontmatter is on, images and
 * links are preserved.
 */
export interface ConvertOptions {
  /**
   * Use Mozilla Readability to extract the main article body before
   * converting. Strips navigation, headers, footers, sidebars, and ads.
   *
   * Set to `false` to convert the entire page DOM (useful for SPAs or
   * pages where Readability mis-identifies the content).
   *
   * @default true
   */
  reader?: boolean;

  /**
   * Prepend a YAML frontmatter block containing `title`, `url` (if
   * provided), `date` (today's date), and `description`.
   *
   * @default true
   */
  frontmatter?: boolean;

  /**
   * The canonical URL of the source page. Added to frontmatter under
   * the `url` key when {@link ConvertOptions.frontmatter} is `true`.
   */
  url?: string;

  /**
   * Remove all `<img>`, `<picture>`, and `<figure>` elements from the
   * output. Useful when only the text content matters.
   *
   * @default false
   */
  stripImages?: boolean;

  /**
   * Convert hyperlinks (`<a href="...">text</a>`) to plain text,
   * discarding the `href`. Useful for cleaner LLM prompts where URLs
   * add noise.
   *
   * @default false
   */
  stripLinks?: boolean;
}

/**
 * The result returned by {@link convert}.
 */
export interface ConvertResult {
  /** The converted Markdown string, including frontmatter if enabled. */
  markdown: string;
  /**
   * The page title extracted from `<meta property="og:title">` or
   * `<title>`. `undefined` if no title was found.
   */
  title?: string;
  /**
   * The page description extracted from `<meta property="og:description">`
   * or `<meta name="description">`. `undefined` if none was found.
   */
  description?: string;
}

/**
 * Convert an HTML string to Markdown.
 *
 * Reads meta tags for frontmatter, optionally extracts just the article
 * body via Mozilla Readability, then converts the remaining HTML with
 * Turndown.
 *
 * @example Basic usage (reader mode + frontmatter, the default)
 * ```ts
 * import { convert } from "@placeholder/html2md";
 *
 * const html = await fetch("https://example.com").then(r => r.text());
 * const { markdown } = convert(html, { url: "https://example.com" });
 * console.log(markdown);
 * ```
 *
 * @example Strip links and images for a clean LLM prompt
 * ```ts
 * const { markdown } = convert(html, {
 *   url: "https://example.com",
 *   stripLinks: true,
 *   stripImages: true,
 * });
 * ```
 *
 * @example Full page conversion without reader-mode extraction
 * ```ts
 * const { markdown } = convert(html, { reader: false, frontmatter: false });
 * ```
 *
 * @param html  Raw HTML string to convert.
 * @param opts  Conversion options. All fields are optional.
 * @returns     A {@link ConvertResult} with `markdown`, `title`, and `description`.
 */
export function convert(
  html: string,
  opts: ConvertOptions = {},
): ConvertResult {
  const {
    reader = true,
    frontmatter = true,
    url,
    stripImages = false,
    stripLinks = false,
  } = opts;

  const document = parseDocument(html);
  const { title, description } = extractMeta(document);
  const contentHtml = extractContent(document, html, reader);

  const td = buildTurndown({ stripImages, stripLinks });
  const body = td.turndown(contentHtml);

  const parts: string[] = [];
  if (frontmatter) {
    parts.push(buildFrontmatter(title, description, url));
  }
  parts.push(body);

  return {
    markdown: parts.join("\n\n"),
    title: title || undefined,
    description: description || undefined,
  };
}
