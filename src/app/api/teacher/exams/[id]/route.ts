import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
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


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const examId = params.id;
    const data = await req.json();

    // First, update the exam's basic details
    const updatedExam = await prisma.exam.update({
      where: { id: examId },
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
        isMock: data.isMock,
        examCode: data.examCode,
      },
    });

    // Next, update the exam questions.
    // In this simple approach, we delete all existing questions and re-create them.
    await prisma.question.deleteMany({ where: { examId } });
    if (data.questions && data.questions.length > 0) {
      for (const [index, question] of data.questions.entries()) {
        await prisma.question.create({
          data: {
            examId,
            content: question.content,
            options: question.options,
            correctAnswer: question.correctAnswer,
            points: question.points,
            order: index + 1,
            diagram: question.diagram || null,
            explanation: question.explanation || null,
          },
        });
      }
    }

    return NextResponse.json({ message: "Exam updated", exam: updatedExam });
  } catch (error: any) {
    console.error("Error updating exam:", error);
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
  }
}
