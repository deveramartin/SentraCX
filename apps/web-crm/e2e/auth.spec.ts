import { test, expect } from "@playwright/test";

test.describe("Sign-in page", () => {
  test("redirects unauthenticated users to the sign-in page", async ({ page }) => {
    await page.goto("/customers");
    // Unauthenticated access should land on sign-in
    await expect(page).toHaveURL(/signin|login/i);
  });

  test("sign-in page loads without errors", async ({ page }) => {
    await page.goto("/signin");
    // Should not show an error page
    await expect(page).not.toHaveURL(/500|error/i);
    // Page should contain some content
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
