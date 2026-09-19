import type { WalletUser } from "@/src/types/wallet.types";

export type SessionState = {
  hydrated: boolean;
  isAuthenticated: boolean;
  user: WalletUser | null;
};

export type SessionHydratedPayload = {
  isAuthenticated: boolean;
  user: WalletUser | null;
};

export type SessionBootstrapProps = {
  children: React.ReactNode;
};
