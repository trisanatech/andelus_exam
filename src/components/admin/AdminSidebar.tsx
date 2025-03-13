// components/admin/AdminSidebar.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-card p-4 border-r border-border sticky top-0 h-screen">
      <h2 className="text-xl font-bold mb-6 text-foreground">Admin Panel</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/admin/dashboard"
              className={cn(
                "text-sm font-medium text-foreground hover:text-primary"
              )}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={cn(
                "text-sm font-medium text-foreground hover:text-primary"
              )}
            >
              User Management
            </Link>
          </li>
          <li>
            <Link
              href="/admin/exams"
              className={cn(
                "text-sm font-medium text-foreground hover:text-primary"
              )}
            >
              Exam Management
            </Link>
          </li>
          <li>
            <Link
              href="/admin/analytics"
              className={cn(
                "text-sm font-medium text-foreground hover:text-primary"
              )}
            >
              Analytics
            </Link>
          </li>
          <li>
            <Link
              href="/admin/settings"
              className={cn(
                "text-sm font-medium text-foreground hover:text-primary"
              )}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
