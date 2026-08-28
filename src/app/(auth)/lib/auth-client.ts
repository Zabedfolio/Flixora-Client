import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || (process.env.BETTER_AUTH_URL ? `${process.env.BETTER_AUTH_URL}/api/auth` : undefined),
});

export const { signIn, signUp, signOut, useSession } = authClient;
