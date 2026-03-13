import TurndownService from "turndown";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export interface ConvertOptions {
  /**
   * Use Mozilla Readability to extract the main article body.
   * Strips nav, header, footer, sidebars. Default: true.
   */
  reader?: boolean;

  /** Include YAML frontmatter with title, url, date, description. Default: true. */
  frontmatter?: boolean;

  /** Source URL — used in frontmatter and to resolve relative links. */
  url?: string;

  /** Strip all images. Default: false. */
  stripImages?: boolean;

  /** Convert links to plain text (no href). Default: false. */
  stripLinks?: boolean;
}

export interface ConvertResult {
  markdown: string;
  title?: string;
  description?: string;
}

function buildTurndown(opts: ConvertOptions): TurndownService {
  // deno-lint-ignore no-explicit-any
  const td = new (TurndownService as any)({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    hr: "---",
    linkStyle: "inlined",
  });

  td.remove(["script", "style", "noscript", "iframe"]);

  if (opts.stripImages) {
    td.addRule("stripImages", {
      filter: ["img", "picture", "figure"],
      replacement: () => "",
    });
  }

  if (opts.stripLinks) {
    td.addRule("plainLinks", {
      filter: "a",
      replacement: (content: string) => content,
    });
  }

  // Strikethrough
  td.addRule("strikethrough", {
    filter: ["del", "s", "strike"],
    replacement: (content: string) => `~~${content}~~`,
  });

  return td;
}

function extractMeta(document: ReturnType<typeof parseHTML>["document"]): {
  title: string;
  description: string;
} {
  const title =
    document.querySelector("meta[property='og:title']")?.getAttribute(
      "content",
    ) ??
      document.querySelector("title")?.textContent ??
      "";

  const description =
    document.querySelector("meta[property='og:description']")?.getAttribute(
      "content",
    ) ??
      document.querySelector("meta[name='description']")?.getAttribute(
        "content",
      ) ??
      "";

  return { title: title.trim(), description: description.trim() };
}

function buildFrontmatter(
  title: string,
  description: string,
  url?: string,
): string {
  const date = new Date().toISOString().split("T")[0];
  const lines = ["---"];
  if (title) lines.push(`title: "${title.replace(/"/g, '\\"')}"`);
  if (url) lines.push(`url: "${url}"`);
  lines.push(`date: ${date}`);
  if (description) {
    lines.push(`description: "${description.replace(/"/g, '\\"')}"`);
  }
  lines.push("---");
  return lines.join("\n");
}

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

  const { document } = parseHTML(html);
  const { title, description } = extractMeta(document);

  let contentHtml: string;

  if (reader) {
    const article = new Readability(
      document as unknown as Document,
    ).parse();
    contentHtml = article?.content ?? html;
  } else {
    // Full page — just remove the guaranteed-noise elements
    for (
      const tag of [
        "script",
        "style",
        "noscript",
        "nav",
        "header",
        "footer",
        "aside",
        "iframe",
      ]
    ) {
      document.querySelectorAll(tag).forEach((el: Element) => el.remove());
    }
    contentHtml = document.body?.innerHTML ?? html;
  }

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
