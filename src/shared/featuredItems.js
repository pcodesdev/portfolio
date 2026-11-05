export const MAX_FEATURED_ITEMS = 6;

export function limitFeaturedItems(items) {
  return Array.isArray(items) ? items.slice(0, MAX_FEATURED_ITEMS) : [];
}
