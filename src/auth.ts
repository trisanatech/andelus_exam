import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireTeacherSession() {
  const session = await getServerSession(authOptions as any);
  if (!session || session.user.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }
  return session;
}
