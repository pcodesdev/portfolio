import fs from "fs";
import path from "path";

const publicDirectory = path.resolve(__dirname, "../public");
const monogramPath = path.join(__dirname, "assests/images/pn-monogram.svg");

test("header and browser/PWA icon use the same accessible PN brand mark", () => {
  const sourceLogo = fs.readFileSync(monogramPath, "utf8");
  const favicon = fs.readFileSync(
    path.join(publicDirectory, "icons/pn-monogram.svg"),
    "utf8"
  );
  const html = fs.readFileSync(
    path.join(publicDirectory, "index.html"),
    "utf8"
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(publicDirectory, "manifest.json"), "utf8")
  );

  expect(sourceLogo).toContain("PN");
  expect(favicon).toContain("PN");
  expect(html).toContain("icons/pn-monogram.svg");
  expect(html).not.toContain("favicon-16x16.png");
  expect(html).not.toContain("favicon-32x32.png");
  expect(manifest.icons).toEqual([
    {
      src: "icons/pn-monogram.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any",
    },
  ]);
  expect(manifest.theme_color).toBe("#0B2B55");
});
