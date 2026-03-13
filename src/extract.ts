import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";

export type Document = ReturnType<typeof parseHTML>["document"];

export interface Meta {
  title: string;
  description: string;
}

export function extractMeta(document: Document): Meta {
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

export function extractContent(
  document: Document,
  html: string,
  reader: boolean,
): string {
  if (reader) {
    const article = new Readability(
      document as unknown as globalThis.Document,
    ).parse();
    return article?.content ?? html;
  }

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
  return document.body?.innerHTML ?? html;
}

export function parseDocument(html: string): Document {
  return parseHTML(html).document;
}
