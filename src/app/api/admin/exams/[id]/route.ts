import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const updatedExam = await prisma.exam.update({
      where: { id: params.id },
      data: body,
      include: {
        subject: true,
        _count: {
          select: {
            questions: true,
            submissions: true,
          },
        },
      },
    });

    return NextResponse.json({ exam: updatedExam });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
