import { test, expect } from "@playwright/test";

const pages = ["/", "/team", "/about", "/services", "/research", "/gallery", "/careers", "/contact"];

for (const path of pages) {
  test(`no broken images on ${path}`, async ({ page }) => {
    await page.goto("http://localhost:5173" + path, { waitUntil: "networkidle" });

    // Lazy images load karne ke liye neeche tak scroll
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 150));
      }
    });
    await page.waitForTimeout(500);

    const broken = await page.$$eval("img", imgs =>
      imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src)
    );
    expect(broken, `Broken images on ${path}`).toEqual([]);
  });
}
