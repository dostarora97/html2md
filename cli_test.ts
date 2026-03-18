import { assertEquals, assertStringIncludes } from "@std/assert";

const SIMPLE_HTML =
  `<html><head><title>Test Page</title></head><body><article><h1>Hello</h1><p>World</p></article></body></html>`;

async function runCli(
  html: string,
  args: string[] = [],
): Promise<{ stdout: string; stderr: string; code: number }> {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-read", "--allow-env", "cli.ts", ...args],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  const process = cmd.spawn();
  const writer = process.stdin.getWriter();
  await writer.write(new TextEncoder().encode(html));
  await writer.close();
  const { stdout, stderr, code } = await process.output();
  return {
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
    code,
  };
}

Deno.test("cli: exits 0 and outputs markdown on valid input", async () => {
  const { stdout, code } = await runCli(SIMPLE_HTML);
  assertEquals(code, 0);
  assertStringIncludes(stdout, "Hello");
});

Deno.test("cli: exits 1 and prints error on empty stdin", async () => {
  const { stderr, code } = await runCli("   ");
  assertEquals(code, 1);
  assertStringIncludes(stderr, "no input received");
});

Deno.test("cli: --help exits 0 and prints usage", async () => {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-read", "--allow-env", "cli.ts", "--help"],
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
  });
  const { stdout, code } = await cmd.output();
  assertEquals(code, 0);
  assertStringIncludes(new TextDecoder().decode(stdout), "html2md");
});

Deno.test("cli: --no-frontmatter omits YAML block", async () => {
  const { stdout, code } = await runCli(SIMPLE_HTML, ["--no-frontmatter"]);
  assertEquals(code, 0);
  assertEquals(stdout.startsWith("---"), false);
});

Deno.test("cli: --url embeds URL in frontmatter", async () => {
  const { stdout, code } = await runCli(SIMPLE_HTML, [
    "--url",
    "https://example.com",
  ]);
  assertEquals(code, 0);
  assertStringIncludes(stdout, 'url: "https://example.com"');
});

Deno.test("cli: --full keeps full page content", async () => {
  const html =
    `<html><head><title>T</title></head><body><nav>Nav</nav><p>Content</p></body></html>`;
  const { stdout, code } = await runCli(html, [
    "--full",
    "--no-frontmatter",
  ]);
  assertEquals(code, 0);
  assertStringIncludes(stdout, "Content");
});

Deno.test("cli: --strip-images removes images", async () => {
  const html =
    `<html><head><title>T</title></head><body><article><img src="photo.jpg" alt="photo"><p>text</p></article></body></html>`;
  const { stdout, code } = await runCli(html, [
    "--strip-images",
    "--no-frontmatter",
  ]);
  assertEquals(code, 0);
  assertEquals(stdout.includes("photo.jpg"), false);
});

Deno.test("cli: --strip-links converts links to plain text", async () => {
  const html =
    `<html><head><title>T</title></head><body><article><p>Visit <a href="https://example.com">example.com</a></p></article></body></html>`;
  const { stdout, code } = await runCli(html, [
    "--strip-links",
    "--no-frontmatter",
  ]);
  assertEquals(code, 0);
  assertEquals(stdout.includes("https://example.com"), false);
  assertStringIncludes(stdout, "example.com");
});
