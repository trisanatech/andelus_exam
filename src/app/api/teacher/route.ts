import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const teacherId = session.user.id;
  try {
    // Parse the incoming JSON data
    const data = await req.json();
    console.log("Received datffa:", data);
console.log(" order data:", data.order);
    // Validate required fields
    if (!data || !data.title || !data.subjectId || !data.questions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the exam along with its questions
    const exam = await prisma.exam.create({
      data: {
        title: data.title,
        subjectId: data.subjectId,
        gradeLevel: data.gradeLevel,
        duration: data.duration,
        scheduledAt: new Date(data.scheduledAt),
        // endAt: new Date(data.endAt),
        instructions: data.instructions,
        shuffleOptions: data.shuffleOptions,
        randomizeOrder: data.randomizeOrder,
        passingScore: data.passingScore,
        maxScore: data.maxScore,
        teacherId: teacherId,
        isMock: data.isMock,
        examCode: data.examCode,
        questions: {
          create: data.questions.map((question: any, index: number) => ({
            content: question.content, // Stored as JSON per your model
            options: question.options, // Stored as JSON array
            correctAnswer: question.correctAnswer, // Stored as JSON array
            points: question.points || 1,
            order: index + 1,
            diagram: question.diagram || null,
            explanation: question.explanation || null,
          })),
        },
      },
      include: { questions: true },
    });

    // Return a successful response
    return NextResponse.json(
      { message: "Exam created successfully", exam },
      { status: 201 }
    );
  } catch (error) {
    // Log a safe string representation of the error to avoid payload serialization issues
    console.error(
      "Error creating exam:",
      error ? error.toString() : "Unknown error"
    );

    // Extract an error message safely
    const errMsg =
      error &&
      typeof error === "object" &&
      "message" in error &&
      (error as any).message
        ? (error as any).message
        : "Unknown error";

    // Return a JSON response with error details
    return NextResponse.json(
      { error: "Internal Server Error", details: errMsg },
      { status: 500 }
    );
  }
}
