// "use client";
// import Sidebar from "@/components/sidebar";
// import {TeacherSidebar} from "@/components/teacher/teacherSidebar";
// import { usePathname } from "next/navigation";

// export default function StudentsLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   const showSidebar = pathname.includes("/exam") || pathname.includes("/mock");

//   return (
//     <div className="flex min-h-screen">
//       {/* Main Content */}
//       <TeacherSidebar />
//       <main className="flex-1 p-8">{children}</main>

//       {/* Sidebar (conditionally rendered) */}
//       {showSidebar && (
//         // <aside className="w-72 sticky top-16 bg-background shadow-lg rounded-lg 
//         // p-4 overflow-y-auto max-h-[calc(100vh-4rem)] border border-border">
//         //   <Sidebar type={pathname.includes("/exam") ? "exam" : "mock"} />
//         // </aside>
//         <Sidebar type={pathname.includes("/exam") ? "exam" : "mock"} />
//       )}
//     </div>
//   );
// }
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
  if (!session || session.user.role !== "TEACHER" && session.user.role !== "ADMIN" ) {
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
