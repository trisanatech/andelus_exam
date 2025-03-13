import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER" && session.user.role !== "ADMIN" ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Create the exam
    const exam = await prisma.exam.create({
      data: {
        title: data.title,
        subjectId: data.subjectId,
        gradeLevel: data.gradeLevel,
        duration: data.duration,
        scheduledAt: new Date(data.scheduledAt),
        instructions: data.instructions,
        shuffleOptions: data.shuffleOptions,
        randomizeOrder: data.randomizeOrder,
        passingScore: data.passingScore,
        teacherId: data.teacherId,
        maxScore: data.maxScore,
        isMock: data.isMock,
        examCode: data.examCode,
      },
    });

    // Create exam questions
    if (data.questions && data.questions.length > 0) {
      for (const [index, q] of data.questions.entries()) {
        await prisma.question.create({
          data: {
            examId: exam.id,
            content: q.content, // Should be an object, e.g. { text: "Question" }
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
            order: index + 1,
          },
        });
      }
    }

    return NextResponse.json({ message: "Exam created successfully", exam }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating exam:", error);
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}