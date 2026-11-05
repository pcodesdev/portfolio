import { limitFeaturedItems, MAX_FEATURED_ITEMS } from "./featuredItems";
import ProjectsData from "./opensource/projects.json";
import PublicationsData from "./medium/publications.json";

test("curated project and publication data stay within the six-item display limit", () => {
  expect(MAX_FEATURED_ITEMS).toBe(6);
  expect(limitFeaturedItems(ProjectsData.data)).toHaveLength(6);
  expect(limitFeaturedItems(PublicationsData.data)).toHaveLength(6);
});

test("the display limiter caps oversized feeds and keeps smaller feeds intact", () => {
  const items = Array.from({ length: 9 }, (_, index) => index);
  expect(limitFeaturedItems(items)).toEqual([0, 1, 2, 3, 4, 5]);
  expect(limitFeaturedItems(["one", "two"])).toEqual(["one", "two"]);
  expect(limitFeaturedItems(null)).toEqual([]);
});
