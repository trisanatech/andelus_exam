import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch exams that are flagged as mock and are active
    const mockExams = await prisma.exam.findMany({
      where: {
        isMock: true,
        // status: "ACTIVE",
        // scheduledAt: { lte: new Date() },
      },
      include: {
        subject: true,
      },
      orderBy: { scheduledAt: "asc" },
    });
    return NextResponse.json({ mockExams });
  } catch (error: any) {
    console.error("Error fetching mock exams:", error);
    return NextResponse.json({ error: "Failed to fetch mock exams" }, { status: 500 });
  }
}
