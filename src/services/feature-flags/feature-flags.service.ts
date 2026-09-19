"use client";

import { useSyncExternalStore } from "react";

const FEATURE_FLAGS_STORAGE_KEY = "spin.wallet.feature-flags";
const FEATURE_FLAGS_UPDATED_EVENT = "spin:feature-flags-updated";

export type FeatureFlags = {
  transferScenarioSimulation: boolean;
};

const environmentFlagsSnapshot: FeatureFlags = {
  transferScenarioSimulation: process.env.NEXT_PUBLIC_ENABLE_TRANSFER_SCENARIOS !== "false",
};

let cachedFeatureFlagsSnapshot = environmentFlagsSnapshot;

function readStoredFlags(): Partial<FeatureFlags> | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as Partial<FeatureFlags>;
  } catch {
    return null;
  }
}

export function getFeatureFlagsFromEnvironment(): FeatureFlags {
  return environmentFlagsSnapshot;
}

export function getFeatureFlags(): FeatureFlags {
  const storedFlags = readStoredFlags();
  const nextTransferScenarioSimulation =
    storedFlags?.transferScenarioSimulation ?? getFeatureFlagsFromEnvironment().transferScenarioSimulation;

  if (cachedFeatureFlagsSnapshot.transferScenarioSimulation === nextTransferScenarioSimulation) {
    return cachedFeatureFlagsSnapshot;
  }

  cachedFeatureFlagsSnapshot = {
    transferScenarioSimulation: nextTransferScenarioSimulation,
  };

  return cachedFeatureFlagsSnapshot;
}

function subscribeToFeatureFlags(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key && event.key !== FEATURE_FLAGS_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(FEATURE_FLAGS_UPDATED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(FEATURE_FLAGS_UPDATED_EVENT, onStoreChange);
  };
}

export function useFeatureFlags() {
  return useSyncExternalStore(subscribeToFeatureFlags, getFeatureFlags, getFeatureFlagsFromEnvironment);
}

export function setFeatureFlagOverride(flags: Partial<FeatureFlags>) {
  if (typeof window === "undefined") {
    return;
  }

  const currentFlags = getFeatureFlags();

  window.localStorage.setItem(
    FEATURE_FLAGS_STORAGE_KEY,
    JSON.stringify({
      ...currentFlags,
      ...flags,
    }),
  );

  window.dispatchEvent(new Event(FEATURE_FLAGS_UPDATED_EVENT));
}