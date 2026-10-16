export interface Source {
  id: string;
  url: string;
  title: string;
  description?: string;
}
export function sourceUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol)
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}
export function sourceHost(url: string): string {
  const safe = sourceUrl(url);
  return safe ? new URL(safe).hostname.replace(/^www\./, "") : "Source";
}
