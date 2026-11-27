import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/** Every URL the previous Gatsby site served, derived from content so new posts are covered. */
function contentRoutes(): string[] {
  const blogDir = path.join(process.cwd(), "content", "blog");
  const slugs = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(blogDir, d.name, "index.md")))
    .map((d) => `/${d.name}`);
  return slugs;
}

const staticAssetRoutes = [
  "/rss.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
];

const appRoutes = [
  "/",
  "/blog/1",
  "/blog/posts",
  "/blog/tags",
  "/blog/tags/powershell",
  "/blog/tags/command-line",
  "/blog/search",
  "/blog/search?q=powershell",
  "/gallery",
  "/gallery/instagram",
  "/gallery/microscope",
  "/gallery/shoes",
  "/music",
  "/blackjack",
  "/contact",
];

for (const route of staticAssetRoutes) {
  test(`GET ${route} returns 200`, async ({ request }) => {
    const res = await request.get(route);
    expect(res.status(), `${route} status`).toBe(200);
  });
}

test("all app and content routes render without 404", async ({ page }) => {
  for (const route of [...appRoutes, ...contentRoutes()]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { name: "404: Not Found" })).toHaveCount(0);
  }
});

test("legacy URLs redirect client-side", async ({ page }) => {
  await page.goto("/blog");
  await expect(page).toHaveURL(/\/blog\/1$/);

  await page.goto("/posts");
  await expect(page).toHaveURL(/\/blog\/posts$/);

  await page.goto("/collection");
  await expect(page).toHaveURL(/\/$/);
});

test("unknown route renders 404 page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(page.getByRole("heading", { name: "404: Not Found" })).toBeVisible();
});

test("home page lists recent posts and the nav opens", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-list article")).toHaveCount(7);
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.locator("#navbar-menu").getByRole("link", { name: "Gallery" })).toBeVisible();
});

test("blog post renders images with rewritten paths", async ({ page }) => {
  await page.goto("/connect-esxi-host-directly-to-freenas");
  const img = page.locator("article section img").first();
  await expect(img).toHaveAttribute("src", /^\/blog\/connect-esxi-host-directly-to-freenas\//);
  const res = await page.request.get((await img.getAttribute("src"))!);
  expect(res.status()).toBe(200);
});

test("search finds posts", async ({ page }) => {
  await page.goto("/blog/search");
  await page.getByRole("searchbox").fill("powershell");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/blog\/search\?q=powershell/);
  await expect(page.locator(".post-list article").first()).toBeVisible();
});

test("gallery lightbox opens and navigates", async ({ page }) => {
  await page.goto("/gallery/shoes");
  await page.locator(".gallery-tile").first().click();
  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("1 / 36")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("2 / 36")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
