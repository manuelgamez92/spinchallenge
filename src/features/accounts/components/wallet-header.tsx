"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import type { WalletNavigationItem } from "@/src/features/accounts/types/accounts.types";
import { walletHeaderStyles } from "@/src/features/accounts/styles/wallet.styles";
import { logout } from "@/src/features/accounts/services/wallet-api";
import { useSession } from "@/src/features/authentication/hooks/use-session";
import { sessionCleared } from "@/src/features/authentication/store/authentication.slice";
import { cn } from "@/src/lib/cn";
import { Spinner } from "@/src/components/ui/spinner";
import { useAppDispatch } from "@/src/store/hooks";

const navigation: WalletNavigationItem[] = [
  { href: "/home", label: "Inicio" },
  { href: "/transfer", label: "Nueva transacción" },
];

export function WalletHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const session = useSession();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(sessionCleared());

      if (typeof window !== "undefined") {
        window.location.replace("/login");
        return;
      }

      router.replace("/login");
      router.refresh();
    },
  });

  const handleLogout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return (
    <header className={walletHeaderStyles.container}>
      <div>
        <p className={walletHeaderStyles.brand}>Bienvenido</p>
        <h1 className={walletHeaderStyles.name}>{session.user?.fullName ?? "Cliente"}</h1>
      </div>

      <div className={walletHeaderStyles.actions}>
        <nav className={walletHeaderStyles.nav}>
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                className={cn(
                  walletHeaderStyles.navLinkBase,
                  active ? walletHeaderStyles.navLinkActive : walletHeaderStyles.navLinkIdle,
                )}
                href={item.href}
                key={item.href}
              >
                {item.href === "/transfer" ? (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">➕</span>
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            );
          })}
        </nav>

        <button className="secondary-button" disabled={logoutMutation.isPending} onClick={handleLogout} type="button">
          {logoutMutation.isPending ? (
            <span className={walletHeaderStyles.pendingText}>
              <Spinner /> Cerrando...
            </span>
          ) : (
            "Cerrar sesión"
          )}
        </button>
      </div>
    </header>
  );
}