// src/app/unauthorized/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        You do not have permission to view this page.
      </p>
      <Button className="mt-8" onClick={() => router.back()}>
        Go Back
      </Button>
    </div>
  );
}
