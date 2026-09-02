import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';

const getAuthBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/auth`;
  }
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth`;
  }
  if (process.env.BETTER_AUTH_URL) {
    return `${process.env.BETTER_AUTH_URL}/api/auth`;
  }
  return 'http://localhost:3000/api/auth';
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  plugins: [emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
