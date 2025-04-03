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
        
       },
    });
    // Only return if it's a mock exam.
    if (!exam || !exam.isMock) {
      return NextResponse.json({ error: "Mock exam not found" }, { status: 404 });
    }
    return NextResponse.json(exam);
  } catch (error: any) {
    console.error("Error fetching mock exam:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
