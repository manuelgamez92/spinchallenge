import { expect, test } from "@playwright/test";

test("smoke: user sees a transfer error and can retry with the draft preserved", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("spin.wallet.feature-flags", JSON.stringify({ transferScenarioSimulation: true }));
    window.localStorage.setItem("spin.wallet.test-controls", JSON.stringify({ nextTransferOutcome: "network" }));
  });

  await page.goto("/login");
  await page.getByLabel("Email o teléfono").fill("test.user@spin.com");
  await page.getByRole("button", { name: "Entrar al dashboard" }).click();

  await expect(page).toHaveURL(/\/home$/);

  await page.getByRole("link", { name: "Nueva transacción" }).first().click();
  await expect(page).toHaveURL(/\/transfer$/);

  await page.getByLabel("Monto a transferir").fill("100");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Revisar resumen" }).click();
  await page.getByRole("button", { name: "Confirmar transacción" }).click();

  await expect(page).toHaveURL(/\/transfer\/result$/);
  await expect(page.getByRole("heading", { name: "Error de red" })).toBeVisible();
  await expect(page.getByText("Puedes reintentar la confirmación. Tu borrador de transacción se mantiene.")).toBeVisible();

  await page.getByRole("button", { name: "Reintentar" }).click();

  await expect(page).toHaveURL(/\/transfer$/);
  await expect(page.getByLabel("Monto a transferir")).toHaveValue("100");
});