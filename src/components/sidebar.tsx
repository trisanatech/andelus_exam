"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  PlusCircle,
  BookOpen,
} from "lucide-react";

export function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // While session is loading, render a minimal placeholder
  if (status === "loading") {
    return <div className="w-64 p-4">Loading...</div>;
  }

  // Define menu items for each role.
  const adminItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/exams", icon: FileText, label: "Exams" },
    // You can add more admin items here.
  ];

  const teacherItems = [
    { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/teacher/exams", icon: FileText, label: "Exams" },
    // You can add more teacher items here.
  ];

  const studentItems = [
    { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/student/exams", icon: FileText, label: "Exams" },
    // Optionally add student-specific items.
  ];

  let items = [];
  if (session?.user?.role === "ADMIN") {
    items = adminItems;
  } else if (session?.user?.role === "TEACHER") {
    items = teacherItems;
  } else {
    items = studentItems;
  }

  return (
    <div className="w-64 border-r bg-background p-4 flex flex-col">
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className={cn("w-full justify-start", pathname === item.href && "bg-accent")}
          >
            <Link href={item.href}>
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
      <div className="space-y-1">
        <span className="text-sm">© 2025 TRISANA TECH.</span>
        <p className="text-sm text-muted-foreground">All Rights Reserved.</p>
      </div>
    </div>
  );
}
