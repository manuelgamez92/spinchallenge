"use client";

import { useCallback, useState } from "react";

import {
  setFeatureFlagOverride,
  useFeatureFlags,
} from "@/src/services/feature-flags/feature-flags.service";
import { getMockControls, setNextTransferOutcome } from "@/src/features/accounts/services/mocks/mock-controls";
import type { TransferOutcomeSelection } from "@/src/features/transfers/types/transfers.types";

export function useTransferScenarioControls() {
  const featureFlags = useFeatureFlags();
  const scenarioEnabled = featureFlags.transferScenarioSimulation;
  const [forcedOutcome, setForcedOutcome] = useState<TransferOutcomeSelection>(
    () => getMockControls().nextTransferOutcome ?? "random",
  );

  const handleScenarioToggle = useCallback(() => {
    const nextValue = !scenarioEnabled;
    setFeatureFlagOverride({ transferScenarioSimulation: nextValue });

    if (!nextValue) {
      setForcedOutcome("random");
      setNextTransferOutcome(null);
      return;
    }

    setForcedOutcome("random");
    setNextTransferOutcome(null);
  }, [scenarioEnabled]);

  const handleForcedOutcomeChange = useCallback((value: TransferOutcomeSelection) => {
    setForcedOutcome(value);
    setNextTransferOutcome(value === "random" ? null : value);
  }, []);

  return {
    featureFlags,
    scenarioEnabled,
    forcedOutcome,
    handleScenarioToggle,
    handleForcedOutcomeChange,
  };
}