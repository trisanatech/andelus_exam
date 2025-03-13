import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const exams = await prisma.exam.findMany({
      include: {
        subject: true,
        _count: {
          select: {
            questions: true,
            submissions: true,
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });
    return NextResponse.json({ exams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
