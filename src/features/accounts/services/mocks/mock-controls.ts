import { readStorage } from "@/src/services/storage.service";
import { getFeatureFlags } from "@/src/services/feature-flags/feature-flags.service";

type MockControls = {
  loginFailure?: boolean;
  nextTransferOutcome?: "success" | "network" | "timeout" | "unknown" | "insufficient-funds";
};

export type TransferOutcomeControl = NonNullable<MockControls["nextTransferOutcome"]>;

const CONTROLS_KEY = "spin.wallet.test-controls";

export function getMockControls() {
  return readStorage<MockControls>(CONTROLS_KEY, {});
}

export function consumeNextTransferOutcome() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const current = getMockControls();

  if (!current.nextTransferOutcome) {
    return undefined;
  }

  window.localStorage.setItem(
    CONTROLS_KEY,
    JSON.stringify({
      ...current,
      nextTransferOutcome: undefined,
    }),
  );

  return current.nextTransferOutcome;
}

export function setNextTransferOutcome(outcome: TransferOutcomeControl | null) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getMockControls();
  const nextControls: MockControls = {
    ...current,
  };

  if (outcome) {
    nextControls.nextTransferOutcome = outcome;
  } else {
    delete nextControls.nextTransferOutcome;
  }

  window.localStorage.setItem(CONTROLS_KEY, JSON.stringify(nextControls));
}

export function shouldSimulateTransferScenarios() {
  return getFeatureFlags().transferScenarioSimulation;
}