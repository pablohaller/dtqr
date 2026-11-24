import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const tokens = await response.json();
    if (!response.ok) throw tokens;

    return {
      accessToken: tokens.access_token as string,
      expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
      // Google may not return a new refresh token — keep the old one.
      refreshToken: (tokens.refresh_token as string) ?? refreshToken,
    };
  } catch {
    return { error: "RefreshAccessTokenError" as const };
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `openid email profile ${DRIVE_SCOPE}`,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      // Initial sign-in — persist the Google tokens on the JWT.
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        };
      }

      // Still valid — reuse it.
      if (token.expiresAt && Date.now() < Number(token.expiresAt) * 1000) {
        return token;
      }

      // Expired — refresh.
      if (!token.refreshToken) return { ...token, error: "RefreshAccessTokenError" };

      const refreshed = await refreshAccessToken(String(token.refreshToken));
      return refreshed.error
        ? { ...token, error: refreshed.error }
        : {
            ...token,
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            expiresAt: refreshed.expiresAt,
            error: undefined,
          };
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken as string | undefined;
      session.error = token.error as string | undefined;
      return session;
    },
  },
});
