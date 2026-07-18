import { test, expect } from "@playwright/test";

test.describe("App navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Mock all CRM API calls so the app doesn't need a live backend
    await page.route("**/api/v1/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], totalCount: 0, totalPages: 1, page: 1, pageSize: 20 }),
      });
    });
  });

  test("root redirects to a known route", async ({ page }) => {
    await page.goto("/");
    // Should land somewhere in the app (not a 404/500)
    await expect(page).not.toHaveURL(/404|500/);
  });

  test("dashboard page loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).not.toHaveURL(/404|500/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("tickets page loads", async ({ page }) => {
    await page.goto("/tickets");
    await expect(page).not.toHaveURL(/404|500/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("campaigns page loads", async ({ page }) => {
    await page.goto("/campaigns");
    await expect(page).not.toHaveURL(/404|500/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("conversations page loads", async ({ page }) => {
    await page.goto("/conversations");
    await expect(page).not.toHaveURL(/404|500/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("non-existent route shows a not-found page", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist-xyz");
    // Next.js returns 404 for unknown routes
    expect(response?.status()).toBe(404);
  });
});
