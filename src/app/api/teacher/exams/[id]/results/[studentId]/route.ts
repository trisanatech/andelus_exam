import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    // Ensure the requester is a teacher or admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
      console.error("Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Our folder is [id] so the exam ID is in params.id
    const examId = params.id;
    const studentId = params.studentId;
    // Fetch the exam (including subject and questions)
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        subject: true,
        questions: {
          orderBy: { order: 'asc' },
        },
        _count: { select: { questions: true, submissions: true } },
      },
    });
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    
    // Fetch the student's submission for the exam
    const submission = await prisma.submission.findFirst({
      where: { examId, studentId },
      include: { student: true },
    });

    // Fetch the result record if it exists
    const result = await prisma.result.findFirst({
      where: { examId, studentId },
    });

    // Merge submission and result fields (if submission exists)
    const mergedSubmission = submission ? { ...submission, ...result } : null;

    return NextResponse.json({ exam, submission: mergedSubmission }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching exam result:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
