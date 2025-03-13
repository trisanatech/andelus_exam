"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Your auth helper that wraps getServerSession

export async function getExams() {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized: Only teachers or admins can view exams");
  }

  // If teacher, filter by teacherId; if admin, fetch all exams.
  if (session.user.role === "TEACHER") {
    const teacherId = session.user.id; // This should now be defined
    console.log("teacher:", teacherId);
    return prisma.exam.findMany({
      where: { teacherId },
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
  } else {
    // For admin, fetch all exams.
    return prisma.exam.findMany({
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
  }
}

export async function getExamById(id: string) {
  return prisma.exam.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          content: true,
          options: true,
          order: true,
        },
      },
      subject: {
        select: {
          name: true,
        },
      },
    },
  });
}

// export async function getAvailableExams() {
//   try {
//     const exams = await prisma.exam.findMany({
//       where: {
//         status: "ACTIVE", // or however you define "available"
//         scheduledAt: { lte: new Date() },
//       },
//       include: {
//         subject: true,
//       },
//       orderBy: { scheduledAt: "asc" },
//     });
//     return exams;
//   } catch (error) {
//     console.error("Error fetching available exams:", error);
//     return [];
//   }
// }

export async function getStudentSubmissions(studentId: string) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { studentId },
      // You can include exam data if needed:
      // include: { exam: true },
    });
    return submissions;
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    return [];
  }
}

export async function submitExam(data: {
  examId: string;
  answers: Array<{ questionId: string; answer: string }>;
}) {
  return prisma.submission.create({
    data: {
      examId: data.examId,
      answers: JSON.stringify(data.answers),
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });
}

export async function getExamResults(examId) {
  try {
    // Fetch the exam along with its submissions
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        submissions: {
          include: {
            student: true, // Fetch student details
          },
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!exam) {
      throw new Error("Exam not found");
    }

    const totalSubmissions = exam.submissions.length;
    const maxScore = exam.maxScore;
    const passingScore = exam.passingScore || 0.6 * maxScore; // Default to 60% if not set

    const totalScores = exam.submissions.map((s) => s.score || 0);
    const averageScore =
      totalScores.reduce((sum, score) => sum + score, 0) / totalSubmissions ||
      0;

    const passRate =
      (totalScores.filter((s) => s >= passingScore).length / totalSubmissions) *
        100 || 0;

    // Find top scorer
    const topSubmission = exam.submissions.reduce((prev, current) =>
      (prev.score || 0) > (current.score || 0) ? prev : current
    );
    const topScore = topSubmission.score || 0;
    const topScorer = topSubmission.student
      ? topSubmission.student.name
      : "N/A";

    // Prepare score distribution
    const scoreDistribution = [
      {
        range: "0-20%",
        count: totalScores.filter((s) => s <= 0.2 * maxScore).length,
      },
      {
        range: "21-40%",
        count: totalScores.filter(
          (s) => s > 0.2 * maxScore && s <= 0.4 * maxScore
        ).length,
      },
      {
        range: "41-60%",
        count: totalScores.filter(
          (s) => s > 0.4 * maxScore && s <= 0.6 * maxScore
        ).length,
      },
      {
        range: "61-80%",
        count: totalScores.filter(
          (s) => s > 0.6 * maxScore && s <= 0.8 * maxScore
        ).length,
      },
      {
        range: "81-100%",
        count: totalScores.filter((s) => s > 0.8 * maxScore).length,
      },
    ];

    return {
      exam: {
        title: exam.title,
        maxScore,
        averageScore: averageScore.toFixed(2),
        passRate: passRate.toFixed(2),
        passingScore,
        topScore,
        topScorer,
        scoreDistribution,
      },
      submissions: exam.submissions.map((submission) => ({
        id: submission.id,
        student: { id: submission.student.id, name: submission.student.name },
        totalScore: submission.score || 0,
        percentage: ((submission.score || 0) / maxScore) * 100,
        grade: getGrade(submission.score || 0, maxScore),
        status: (submission.score || 0) >= passingScore ? "Passed" : "Failed",
        submittedAt: submission.submittedAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching exam results:", error);
    throw new Error("Failed to fetch exam results.");
  }
}

// Helper function to calculate grades
function getGrade(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

// src/actions/exam.ts
export async function getStudentResult(examId: string) {
  // Use an environment variable or fallback for local development.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/student/exams/${examId}/result`, {
    cache: "no-store",
  });
  console.log("Fetching exam result:", examId);
  if (!res.ok) {
    throw new Error("Failed to fetch exam result");
  }
  return res.json();
}
