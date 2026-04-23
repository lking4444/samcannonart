export function normaliseTag(tag: string): string {
    return tag.trim().replace(/\s+/g, " ").toLowerCase();
}
  
export function formatTagForDisplay(tag: string): string {
    const normalized = normaliseTag(tag);

    if (!normalized) return "";

    return normalized
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}