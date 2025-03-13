"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Hide the navbar if the route is an exam-taking page (adjust condition as needed)
  const hideNavbar = pathname.startsWith("/student/exams/") && pathname.endsWith("/take");
  
  return hideNavbar ? null : <Navbar />;
}
