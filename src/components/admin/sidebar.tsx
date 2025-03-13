"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/exams", icon: FileText, label: "Exams" },
    // { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
    // { href: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="w-64 border-r bg-background p-4 flex flex-col">
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === item.href && "bg-accent"
            )}
          >
            <Link href={item.href}>
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
      <div className="space-y-1">
        <span className="text-sm ">© 2025 TRISANA TECH. </span>
        <p className="text-sm text-muted-foreground">
          All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
