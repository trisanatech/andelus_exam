// src/app/(teacher)/teacher/exams/[id]/results/page.tsx
import TeacherExamResultsClient from "./TeacherExamResultsClient";
import { prisma } from "@/lib/prisma";

async function getExamResults(examId: string) {
  // Fetch the exam with its questions and submissions (including student details)
  const examData = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: true,
      submissions: {
        include: { student: true },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!examData) {
    throw new Error("Exam not found");
  }

  // Fetch all results for this exam (each result is linked to a student)
  const results = await prisma.result.findMany({
    where: { examId },
  });

  // Merge each submission with its corresponding result (if available)
  const submissions = examData.submissions.map((submission) => {
    const result = results.find((r) => r.studentId === submission.studentId);
    return {
      ...submission,
      totalScore: result ? result.totalScore : submission.score || 0,
      percentage: result
        ? result.percentage
        : submission.score
        ? (submission.score / examData.maxScore) * 100
        : 0,
      grade: result ? result.grade : "",
      feedback: result ? result.feedback : "",
      gradedAt: result ? result.gradedAt : null,
    };
  });

  // Calculate overall statistics
  const totalSubmissions = submissions.length;
  const maxScore = examData.maxScore;
  const passingScore = examData.passingScore || Math.round(0.6 * maxScore);

  const totalScores = submissions.map((s) => s.totalScore || 0);
  const averageScore = totalSubmissions > 0
    ? totalScores.reduce((sum, s) => sum + s, 0) / totalSubmissions
    : 0;
  const passRate = totalSubmissions > 0
    ? (totalScores.filter((s) => s >= passingScore).length / totalSubmissions) * 100
    : 0;

  // Determine top scorer (based on highest score)
  const topSubmission = submissions.reduce((prev, curr) =>
    (prev.totalScore || 0) > (curr.totalScore || 0) ? prev : curr
  );
  const topScore = topSubmission.totalScore || 0;
  const topScorer = topSubmission.student
    ? topSubmission.student.displayName ||
      topSubmission.student.username ||
      topSubmission.student.email
    : "N/A";

  // Prepare score distribution (customize ranges as needed)
  const scoreDistribution = [
    { range: "0-20%", count: totalScores.filter((s) => s <= 0.2 * maxScore).length },
    { range: "21-40%", count: totalScores.filter((s) => s > 0.2 * maxScore && s <= 0.4 * maxScore).length },
    { range: "41-60%", count: totalScores.filter((s) => s > 0.4 * maxScore && s <= 0.6 * maxScore).length },
    { range: "61-80%", count: totalScores.filter((s) => s > 0.6 * maxScore && s <= 0.8 * maxScore).length },
    { range: "81-100%", count: totalScores.filter((s) => s > 0.8 * maxScore).length },
  ];

  return {
    exam: {
      title: examData.title,
      maxScore,
      averageScore: Number(averageScore.toFixed(2)),
      passRate: Number(passRate.toFixed(2)),
      passingScore,
      topScore,
      topScorer: { name: topScorer },
      scoreDistribution,
      questions: examData.questions,
    },
    submissions,
  };
}

export default async function ExamResultsPage({ params }: { params: { id: string } }) {
  const { exam, submissions } = await getExamResults(params.id);
  return <TeacherExamResultsClient exam={exam} submissions={submissions} />;
}
