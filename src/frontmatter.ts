export function buildFrontmatter(
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
