
import { Sidebar } from '@/components/sidebar';
import { auth } from '@/lib/auth'; // Ensure your auth() returns the session with role info
import { redirect } from "next/navigation";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the current session
  const session = await auth();

  // If no session or the role is not "teacher", redirect to an unauthorized page.
  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user.displayName || session.user.name || "Guest"}
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
