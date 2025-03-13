// src/app/api/student/availableExams/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  // Get the current student's session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const studentId = session.user.id;

  // Fetch active exams (assuming "ACTIVE" means available for students)
  const activeExams = await prisma.exam.findMany({
    where: {
      status: "ACTIVE",
      isMock: false,
      //scheduledAt: { lte: new Date() }, // Exams that have started
    },
    include: { subject: true },
    orderBy: { scheduledAt: "asc" },
  });

  // Fetch the student's submissions
  const submissions = await prisma.submission.findMany({
    where: { studentId },
    select: { examId: true, status: true },
  });

  // Filter exams:
  // An exam is "available" if there's no submission for it, or if the submission is still DRAFT.
  const availableExams = activeExams.filter((exam) => {
    const sub = submissions.find(
      (s) =>
        String(s.examId).toLowerCase() === String(exam.id).toLowerCase()
    );
    return !sub || sub.status === "DRAFT";
  });

  return NextResponse.json({ availableExams });
}
