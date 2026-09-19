"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SESSION_COOKIE_NAME } from "@/src/features/authentication/constants/session.constants";
import { sessionCleared } from "@/src/features/authentication/store/authentication.slice";
import { useAppDispatch } from "@/src/store/hooks";

type ProtectedSessionGuardProps = {
  children: React.ReactNode;
};

function hasActiveSessionCookie() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === `${SESSION_COOKIE_NAME}=active`);
}

export function ProtectedSessionGuard({ children }: ProtectedSessionGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const enforceActiveSession = () => {
      if (hasActiveSessionCookie()) {
        return;
      }

      dispatch(sessionCleared());
      router.replace("/login");
      router.refresh();
    };

    enforceActiveSession();

    window.addEventListener("pageshow", enforceActiveSession);
    window.addEventListener("focus", enforceActiveSession);
    window.addEventListener("popstate", enforceActiveSession);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        enforceActiveSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", enforceActiveSession);
      window.removeEventListener("focus", enforceActiveSession);
      window.removeEventListener("popstate", enforceActiveSession);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, router]);

  return children;
}