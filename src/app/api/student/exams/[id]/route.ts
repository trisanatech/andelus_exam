import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
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

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
