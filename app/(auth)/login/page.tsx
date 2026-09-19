import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginScreen } from "@/src/features/authentication/components/login-screen";
import { SESSION_COOKIE_NAME } from "@/src/features/authentication/constants/session.constants";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(SESSION_COOKIE_NAME)?.value === "active";

  if (hasSession) {
    redirect("/home");
  }

  return <LoginScreen />;
}