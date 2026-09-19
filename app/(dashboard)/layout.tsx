import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAME } from "@/src/features/authentication/constants/session.constants";
import { ProtectedSessionGuard } from "@/src/features/authentication/components/protected-session-guard";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(SESSION_COOKIE_NAME)?.value === "active";

  if (!hasSession) {
    redirect("/login");
  }

  return <ProtectedSessionGuard>{children}</ProtectedSessionGuard>;
}