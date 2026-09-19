import { expect, test } from "@playwright/test";

test("smoke: user can login and complete a successful transfer", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("spin.wallet.feature-flags", JSON.stringify({ transferScenarioSimulation: false }));
  });

  await page.goto("/login");
  await page.getByLabel("Email o teléfono").fill("test.user@spin.com");
  await page.getByRole("button", { name: "Entrar al dashboard" }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText("Saldo disponible")).toBeVisible();

  await page.getByRole("link", { name: "Nueva transacción" }).first().click();
  await expect(page).toHaveURL(/\/transfer$/);

  await page.getByLabel("Monto a transferir").fill("100");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Revisar resumen" }).click();
  await page.getByRole("button", { name: "Confirmar transacción" }).click();

  await expect(page).toHaveURL(/\/transfer\/result$/);
  await expect(page.getByText("Transacción confirmada")).toBeVisible();
  await expect(page.getByRole("heading", { name: /100(\.|,)00 enviados/i })).toBeVisible();
});