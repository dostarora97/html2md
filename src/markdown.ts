import TurndownService from "turndown";

export interface MarkdownOptions {
  stripImages?: boolean;
  stripLinks?: boolean;
}

export function buildTurndown(opts: MarkdownOptions): TurndownService {
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

  td.addRule("strikethrough", {
    filter: ["del", "s", "strike"],
    replacement: (content: string) => `~~${content}~~`,
  });

  return td;
}
