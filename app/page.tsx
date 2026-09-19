import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAME } from "@/src/features/authentication/constants/session.constants";

export default async function RootPage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(SESSION_COOKIE_NAME)?.value === "active";

  redirect(hasSession ? "/home" : "/login");
}
