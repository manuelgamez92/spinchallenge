"use client";

import { useEffect } from "react";

import { initializeMockDatabase } from "@/src/features/accounts/services/mocks/mock-db";
import type { SessionBootstrapProps } from "@/src/features/authentication/types/authentication.types";
import { sessionHydrated } from "@/src/features/authentication/store/authentication.slice";
import { useAppDispatch } from "@/src/store/hooks";

export function SessionBootstrap({ children }: SessionBootstrapProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const database = initializeMockDatabase();

    dispatch(
      sessionHydrated({
        isAuthenticated: database.session.isAuthenticated,
        user: database.session.user,
      }),
    );
  }, [dispatch]);

  return children;
}