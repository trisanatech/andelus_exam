// src/lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust the path as needed

export async function auth() {
  const session = await getServerSession(authOptions);
  return session;
}
