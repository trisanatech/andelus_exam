import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Import a client wrapper for the chart analysis component
import DashboardChartWrapper from "./DashboardChartWrapper";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/unauthorized");
  }

  // Fetch summary stats
  const studentCount = await prisma.user.count({
    where: {
      role: {
        is: { name: "STUDENT" },
      },
    },
  });
  const examCount = await prisma.exam.count({
    where: {
      teacherId: session.user.id,
    },
  });
  const mockexamCount = await prisma.exam.count({
    where: {
      teacherId: session.user.id,
      isMock: true,
    },
  });
  const resultCount = await prisma.result.count({
    where: {
      exam: {
        teacherId: session.user.id,
      },
    },
  });

  // Fetch exam data for analysis (only select necessary fields)
  const exams = await prisma.exam.findMany({
    where: {
      teacherId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      status: true,
      scheduledAt: true,
    },
  });

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        <div className="space-x-4 mt-4 sm:mt-0">
          <Button asChild>
            <Link href="/teacher/exams">Manage Exams</Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Students</p>
          <p className="text-2xl font-semibold">{studentCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Exams</p>
          <p className="text-2xl font-semibold">{examCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Submissions</p>
          <p className="text-2xl font-semibold">{resultCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Mock Exam</p>
          <p className="text-2xl font-semibold">{mockexamCount}</p>
        </Card>
      </div>

      {/* Analysis Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Exam Analysis</h2>
        <DashboardChartWrapper exams={exams} />
      </div>
    </div>
  );
}
