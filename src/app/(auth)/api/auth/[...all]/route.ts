import { auth } from "@/app/(auth)/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Force Next.js API Route Reload for auth configuration
export const { POST, GET } = toNextJsHandler(auth);