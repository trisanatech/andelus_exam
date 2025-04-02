import TeacherExamEditForm from "@/components/teacher/edit/TeacherExamEditForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Fetch exam details including its questions
async function getExam(examId: string) {
  return prisma.exam.findUnique({
    where: { id: examId },
    include: {
      subject: true,
      questions: true,
    },
  });
}

export default async function ExamEditPage({ params }: { params: { id: string } }) {
  // Check authentication and ensure the user is a teacher
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const exam = await getExam(params.id);
  if (!exam) {
    redirect("/admin/exams");
  }

  return <TeacherExamEditForm exam={exam} />;
}
