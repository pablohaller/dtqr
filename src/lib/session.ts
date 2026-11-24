import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HOME } from "@/lib/routes";

/**
 * Returns the current Google access token, redirecting to the sign-in page
 * when there is no valid session (or the token could not be refreshed).
 */
export const requireAccessToken = async () => {
  const session = await auth();
  if (!session?.accessToken || session.error) redirect(HOME);
  return session.accessToken;
};
