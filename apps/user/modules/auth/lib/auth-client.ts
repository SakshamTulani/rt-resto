import { createAuthClient } from "better-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
});

export const { useSession, signIn, signUp, signOut } = authClient;
