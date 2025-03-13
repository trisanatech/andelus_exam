// src/app/api/student/exams/submitted/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try { 
    // Get the current student's session.
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const studentId = session.user.id;

    // Fetch submissions where the student has submitted the exam (i.e. status is not DRAFT)
    const submissions = await prisma.submission.findMany({
      where: { 
        studentId,
        status: { not: "DRAFT" } // Filter out DRAFT submissions.
      },
      include: {
        exam: {
          include: { subject: true }
        }
      },
      orderBy: { submittedAt: "desc" }
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error("Error fetching submitted exams:", error);
    return NextResponse.json({ error: "Failed to fetch submitted exams" }, { status: 500 });
  }
}
