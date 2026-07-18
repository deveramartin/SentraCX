import { test, expect } from "@playwright/test";

/**
 * These tests mock the CRM API so they run without a live backend.
 * They exercise the customers list page UI and key interactions.
 */
test.describe("Customers page", () => {
  const mockCustomers = {
    items: [
      {
        id: "cust-1",
        displayName: "Alice Johnson",
        email: "alice@example.com",
        customerType: "Regular",
        status: "Active",
        createdAt: "2025-01-01T00:00:00Z",
      },
      {
        id: "cust-2",
        displayName: "Bob Corp",
        email: "bob@corp.com",
        customerType: "InstitutionalBuyer",
        status: "Inactive",
        createdAt: "2025-02-01T00:00:00Z",
      },
    ],
    totalCount: 2,
    totalPages: 1,
    page: 1,
    pageSize: 20,
  };

  test.beforeEach(async ({ page }) => {
    // Intercept the CRM API list endpoint
    await page.route("**/api/v1/customers*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockCustomers),
      });
    });
  });

  test("displays the customers list page heading", async ({ page }) => {
    await page.goto("/customers");
    await expect(page.getByRole("heading", { name: /customers/i })).toBeVisible();
  });

  test("renders customer rows from the API", async ({ page }) => {
    await page.goto("/customers");
    await expect(page.getByText("Alice Johnson")).toBeVisible();
    await expect(page.getByText("Bob Corp")).toBeVisible();
  });

  test("shows customer email in the list", async ({ page }) => {
    await page.goto("/customers");
    await expect(page.getByText("alice@example.com")).toBeVisible();
  });

  test("shows customer status badges", async ({ page }) => {
    await page.goto("/customers");
    await expect(page.getByText("Active").first()).toBeVisible();
    await expect(page.getByText("Inactive").first()).toBeVisible();
  });

  test("search input is visible on the customers page", async ({ page }) => {
    await page.goto("/customers");
    const searchInput = page.getByRole("textbox", { name: /search/i });
    await expect(searchInput).toBeVisible();
  });
});
