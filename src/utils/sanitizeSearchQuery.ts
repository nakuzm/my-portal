export function sanitizeSearchQuery(value: string) {
  return value.replace(/[^\p{L}\p{N} ]/gu, '');
}
