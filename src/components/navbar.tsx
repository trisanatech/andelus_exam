"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Boxes } from "lucide-react";
import { ThemeToggle } from "@/components/theme-switcher";
import { UserAuthNav } from "@/components/user-auth-nav";
import { cn } from "../lib/utils";
import { Circle } from "lucide-react";
export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Define navigation items for each role
  const homeNav = [{ href: "/mock", label: "Mock Exam" }];
  const studentNav = [
    { href: "/student/exams", label: "My Exam" },
    { href: "/student/myresult", label: "My Results" },
    { href: "/mock", label: "Mock Exam" },
  ];
  const teacherNav = [
    { href: "/teacher/dashboard", label: "Dashboard" },
    { href: "/mock", label: "Mock Exam" },
    // { href: "/teacher/dashboard", label: "Dashboard" },
    // { href: "/teacher/exams", label: "My Exams" },
    // { href: "/teacher/create-exam", label: "Create Exam" },
  ];
  const adminNav = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/mock", label: "Mock Exam" },
    // { href: "/admin/users", label: "Manage Users" },
  ];

  // Determine which nav items to render based on role
  let navItems = homeNav; // default
  if (session?.user?.role === "TEACHER") {
    navItems = teacherNav;
  } else if (session?.user?.role === "ADMIN") {
    navItems = adminNav;
  } else if (session?.user?.role === "STUDENT") {
    navItems = studentNav;
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="w-full max-w-screen-xl flex h-16 items-center px-4 mx-auto">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-full border border-primary text-primary font-bold">
              A
            </div>
            <span className="hidden font-bold sm:inline-block">
              <span className="text-primary">Andelus-Exam</span>
              <span className="text-muted-foreground">System</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-4">
                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative py-2",
                      pathname === "/"
                        ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                {/* Role-based navigation items */}
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary relative py-2",
                        pathname === item.href || pathname.includes(item.href)
                          ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
            <UserAuthNav />
          </div>
        </div>
      </div>
    </div>
  );
  
}
