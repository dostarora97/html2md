#!/usr/bin/env -S deno run --allow-read --allow-env

import { parseArgs } from "@std/cli/parse-args";
import { convert } from "./mod.ts";

const HELP = `
html2md — convert HTML to Markdown for LLM context

USAGE
  curl -s <url> | html2md [options]
  cat page.html  | html2md [options]

OPTIONS
  --url <url>         Source URL (adds to frontmatter, used for context)
  --full              Convert entire page instead of reader-mode extraction
  --no-frontmatter    Omit YAML frontmatter
  --strip-images      Remove images
  --strip-links       Convert links to plain text
  -h, --help          Show this help

EXAMPLES
  curl -s https://example.com | html2md
  curl -s https://docs.deno.com/runtime/ | html2md --url https://docs.deno.com/runtime/
  curl -s https://example.com | html2md --full --no-frontmatter
  curl -s https://example.com | html2md --strip-links > context.md
`.trim();

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    boolean: ["full", "frontmatter", "strip-images", "strip-links", "help"],
    string: ["url"],
    alias: { h: "help" },
    default: { frontmatter: true },
    negatable: ["frontmatter"],
  });

  if (flags.help) {
    console.log(HELP);
    Deno.exit(0);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of Deno.stdin.readable) {
    chunks.push(chunk);
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }

  const html = new TextDecoder().decode(merged);

  if (!html.trim()) {
    console.error("html2md: no input received on stdin");
    Deno.exit(1);
  }

  const { markdown } = convert(html, {
    reader: !flags.full,
    frontmatter: flags.frontmatter,
    url: flags.url,
    stripImages: flags["strip-images"],
    stripLinks: flags["strip-links"],
  });

  console.log(markdown);
}
