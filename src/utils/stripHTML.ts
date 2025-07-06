/**
 * Strips HTML tags from the provided content and removes extra whitespace.
 *
 * @param content - The string content potentially containing HTML tags.
 * @returns A clean string without HTML tags and extra whitespace.
 */

export function stripHTML(content: string): string {
  // Loại bỏ tất cả thẻ HTML
  const withoutTags = content.replace(/<[^>]+>/g, "");
  // Loại bỏ khoảng trắng thừa và trim
  const clean = withoutTags.replace(/\s+/g, " ").trim();
  return clean;
}
