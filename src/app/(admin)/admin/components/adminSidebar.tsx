"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 border-r h-full">
      <nav className="space-y-4">
        <Link href="/admin/dashboard" className={cn("block text-lg font-medium text-gray-800", "hover:text-primary")}>
          Dashboard
        </Link>
        <Link href="/admin/users" className={cn("block text-lg font-medium text-gray-800", "hover:text-primary")}>
          Users
        </Link>
        <Link href="/admin/students" className={cn("block text-lg font-medium text-gray-800", "hover:text-primary")}>
          Students
        </Link>
        <Link href="/admin/exams" className={cn("block text-lg font-medium text-gray-800", "hover:text-primary")}>
          Exams
        </Link>
        <Link href="/admin/results" className={cn("block text-lg font-medium text-gray-800", "hover:text-primary")}>
          Results
        </Link>
      </nav>
    </aside>
  );
}
