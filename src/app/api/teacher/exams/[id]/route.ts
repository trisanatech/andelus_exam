import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")
  ) {
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

    return NextResponse.json(
      { message: "Exam created successfully", exam },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const examId = params.id;
    const data = await req.json();

    // Update the exam's basic details.
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
        maxScore: data.maxScore,
        examCode: data.examCode,
      },
    });

    // Retrieve all existing questions for this exam.
    const existingQuestions = await prisma.question.findMany({
      where: { examId },
    });
    
    // Get a list of IDs from the incoming data.
    const incomingQuestionIds = data.questions
      .map((q: any) => q.id)
      .filter((id: string) => id); // filter out falsy values

    // Delete questions that exist in the DB but were removed from the payload.
    const questionsToDelete = existingQuestions.filter(
      (q) => !incomingQuestionIds.includes(q.id)
    );
    if (questionsToDelete.length > 0) {
      await prisma.question.deleteMany({
        where: {
          id: { in: questionsToDelete.map((q) => q.id) },
        },
      });
    }

    // Process all question updates/creations in parallel.
    await Promise.all(
      data.questions.map((question: any, index: number) => {
        const questionData = {
          examId,
          content: question.content,
          options: question.options,
          correctAnswer: question.correctAnswer,
          points: question.points,
          order: index + 1,
          diagram: question.diagram || null,
          explanation: question.explanation || null,
        };

        if (question.id) {
          // Update the existing question.
          return prisma.question.update({
            where: { id: question.id },
            data: questionData,
          });
        } else {
          // Create a new question.
          return prisma.question.create({
            data: questionData,
          });
        }
      })
    );

    const redirectTo =
      session.user.role === "ADMIN" ? "/admin/exams" : "/teacher/exams";
    return NextResponse.json(
      { message: "Exam updated", exam: updatedExam, redirectTo },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { error: "Failed to update exam" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const examId = params.id;

    // Delete all results associated with this exam
    await prisma.result.deleteMany({
      where: { examId },
    });

    // Delete all submissions associated with this exam
    await prisma.submission.deleteMany({
      where: { examId },
    });

    // Delete all questions associated with this exam
    await prisma.question.deleteMany({
      where: { examId },
    });

    // Finally, delete the exam
    await prisma.exam.delete({
      where: { id: examId },
    });

    return NextResponse.json({ message: "Exam deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting exam:", error);
    return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
  }
}