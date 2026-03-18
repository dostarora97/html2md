function yamlString(value: string): string {
  return `"${value.replace(/[\r\n]+/g, " ").replace(/"/g, '\\"')}"`;
}

export function buildFrontmatter(
  title: string,
  description: string,
  url?: string,
): string {
  const date = new Date().toISOString().split("T")[0];
  const lines = ["---"];
  if (title) lines.push(`title: ${yamlString(title)}`);
  if (url) lines.push(`url: "${url}"`);
  lines.push(`date: ${date}`);
  if (description) lines.push(`description: ${yamlString(description)}`);
  lines.push("---");
  return lines.join("\n");
}
