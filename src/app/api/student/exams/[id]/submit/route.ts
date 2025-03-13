import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request, { params }: { params: { id: string } }) {
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const studentId = session.user.id;

  try {
    const { answers, examId } = await req.json(); 
    // Fetch the exam and its questions
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const answerMap = answers.reduce((acc: Record<string, string>, cur: any) => {
      const key = Object.keys(cur)[0];
      acc[key] = cur[key];
      return acc;
    }, {});
    // Auto-grade the exam
    let totalScore = 0;
    const maxScore = exam.maxScore || 100;
    const perQuestionScore = maxScore / exam.questions.length;

    for (const question of exam.questions) {
      const studentAnswer = answerMap[question.id];
      // Assume correctAnswer might be stored as an array (e.g., ["1"])
      const correctAnswer = Array.isArray(question.correctAnswer)
        ? question.correctAnswer[0]
        : question.correctAnswer;
      
      if (String(studentAnswer).trim() === String(correctAnswer).trim()) {
        totalScore += perQuestionScore;
      }
    }


    // Calculate percentage
    const percentage = (totalScore / maxScore) * 100;
    // Determine grade (Example: Adjust grading scale as needed)
    let grade;
    if (percentage >= 90) grade = "A";
    else if (percentage >= 80) grade = "B";
    else if (percentage >= 70) grade = "C";
    else if (percentage >= 60) grade = "D";
    else grade = "F";

    // console.log("Total Score:", totalScore);
    // console.log("Percentage:", percentage);
    // console.log("Grade:", grade);
    // console.log("Answers:", answers);
    // console.log("Correct Answers:", exam.questions.map(q => q.correctAnswer));
    // console.log("Student Answers:", answers.map(a => a.answer));
    

    // Check if a submission already exists for the student
    const existingSubmission = await prisma.submission.findFirst({
      where: { examId: examId, studentId },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You have already submitted this exam." },
        { status: 400 }
      );
    }

    // Save submission
    const submission = await prisma.submission.create({
      data: {
        examId,
        studentId,
        answers: answers, // Save submitted answers
        score: totalScore,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    // Save result
    await prisma.result.create({
      data: {
        examId,
        studentId,
        totalScore,
        maxScore,
        percentage,
        grade,
      },
    });

    return NextResponse.json(
      { message: "Exam submitted and graded", submission },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting exam:", error);
    return NextResponse.json(
      { error: "Failed to submit exam" },
      { status: 500 }
    );
  }
}
