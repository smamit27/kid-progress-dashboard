import { test, expect } from "@playwright/test";

test("loads the richer school portal tabs", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Track Amishi Singh's journey from Prep to Class 12.",
    }),
  ).toBeVisible();

  await expect(page.getByRole("tab", { name: /Overview/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Prep Plan/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Teacher Notes/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Reports/ })).toBeVisible();
  await expect(page.getByText("Monday")).toBeVisible();
  await expect(page.getByText("Sunday")).toBeVisible();

  await page.getByRole("tab", { name: /Timetable/ }).click();
  await expect(page.getByText("Full day routine based on her current class")).toBeVisible();
  await expect(page.getByText("Wake up and freshen up")).toBeVisible();

  await page.getByRole("tab", { name: /Food/ }).click();
  await expect(page.getByText("Full meal schedule for a school day")).toBeVisible();
  await expect(page.getByText("Milk + poha")).toBeVisible();
});
