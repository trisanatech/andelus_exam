"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import Loading from "./components/loading";
import { SafeHTMLWithMath } from "./components/SafeHTMLWithMath";

type Exam = {
  id: string;
  title: string;
  subject: { name: string };
  scheduledAt: string;
  maxScore: number;
  questions: any[];
  passingScore: number;
};

type Submission = {
  id: string;
  totalScore: number;
  percentage: number;
  grade?: string;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  startedAt?: string;
  student: {
    id: string;
    displayName?: string;
    username?: string;
    email?: string;
  };
};

export default function TeacherExamResultDetailPage() {
  const router = useRouter();
  // Our dynamic folder is [id] so useParams() returns { id, submissionId }
  const params = useParams() as { id?: string; studentId?: string };
  console.log("Route params:", params);
  const examId = params.id;
  const submissionId = params.studentId;

  const [exam, setExam] = useState<Exam | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to get student's name
  const getStudentName = (student: Submission["student"]) =>
    student?.displayName || student?.username || student?.email || "Unknown";

  useEffect(() => {
    if (!examId || !submissionId) {
      setError("Missing exam or submission ID in URL.");
      setLoading(false);
      return;
    }
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/teacher/exams/${examId}/results/${submissionId}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch detailed result");
        }
        const json = await res.json();
        setExam(json.exam);
        setSubmission(json.submission);
      } catch (err: any) {
        console.error("Error fetching detailed exam result:", err);
        setError(err.message || "Failed to fetch detailed result");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [examId, submissionId]);

  if (loading) return <Loading />;
  if (error)
    return <p className="p-6 text-red-500">{error}</p>;
  if (!exam || !submission)
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">No detailed result found.</p>
        <Button asChild>
          <Link href="/teacher/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );

  // Convert submission.answers into an object mapping for easier lookup.
  const answerMap = Array.isArray(submission?.answers)
    ? submission.answers.reduce((acc: Record<string, string>, cur: any) => {
        const key = Object.keys(cur)[0];
        acc[key] = cur[key];
        return acc;
      }, {})
    : submission?.answers;

  // Compute correct/incorrect counts if not provided.
  let correctCount = submission?.correctCount;
  let incorrectCount = submission?.incorrectCount;
  if (typeof correctCount !== "number" || typeof incorrectCount !== "number") {
    correctCount = 0;
    incorrectCount = 0;
    for (const question of exam.questions) {
      const studentAnswer = answerMap[question.id];
      const correctAnswer = Array.isArray(question.correctAnswer)
        ? question.correctAnswer[0]
        : question.correctAnswer;
      if (String(studentAnswer).trim() === String(correctAnswer).trim()) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  }

  // Format the submission date.
  const submittedAt = submission?.submittedAt
    ? new Date(submission.submittedAt).toLocaleString()
    : "N/A";

  return (
    <div className="p-6 space-y-6">
       <Button variant="outline" onClick={() => router.back()}>
        Back to Results
      </Button>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{exam.title} Results</h1>
        <p className="text-muted-foreground">{exam.subject?.name || "Unknown Subject"}</p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {submission?.student?.displayName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {submission?.student?.email || "N/A"}
            </p>
            <p>
              <strong>ID:</strong> {submission?.studentId}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Summary & Performance */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {submission.totalScore.toFixed(1)}
              <span className="text-base text-muted-foreground">/{exam.maxScore}</span>
            </div>
            <Progress value={(submission.totalScore / exam.maxScore) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {submission.percentage.toFixed(1)}%
            </div>
            <div className="text-sm mt-1">
              <Badge variant={submission.percentage >= exam.passingScore ? "success" : "destructive"}>
                {submission.grade}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Question Breakdown */}
           <Card>
     <CardHeader>
       <CardTitle>Question Breakdown</CardTitle>
     </CardHeader>
     <CardContent className="space-y-4">
       {exam.questions.map((question: any, index: number) => {
         const studentAnswer = answerMap[question.id];
         const correctAnswer = Array.isArray(question.correctAnswer)
           ? question.correctAnswer[0]
           : question.correctAnswer;
         const isCorrect =
           String(studentAnswer).trim() === String(correctAnswer).trim();
         return (
           <details key={question.id} className="border rounded-lg p-4">
             <summary className="flex justify-between items-center cursor-pointer">
               <span>Question {index + 1}</span>
               <Badge variant={isCorrect ? "success" : "destructive"}>
                 {isCorrect ? "Correct" : "Incorrect"}
               </Badge>
             </summary>
             <div className="mt-2 space-y-2">
               <div className="text-muted-foreground">
                 <SafeHTMLWithMath
                   html={
                     typeof question.content === "object"
                       ? question.content.text
                       : question.content
                   }
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-sm text-muted-foreground">Your Answer</p>
                   <div className="font-medium">
                     {studentAnswer != null ? (
                       <SafeHTMLWithMath
                         html={
                           typeof question.options[Number(studentAnswer)] === "object"
                             ? question.options[Number(studentAnswer)].text
                             : question.options[Number(studentAnswer)] || ""
                         }
                       />
                     ) : (
                       "No answer"
                     )}
                   </div>
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Correct Answer</p>
                   <div className="font-medium text-green-600">
                     <SafeHTMLWithMath
                       html={
                         typeof question.options[Number(correctAnswer)] === "object"
                           ? question.options[Number(correctAnswer)].text
                           : question.options[Number(correctAnswer)] || ""
                       }
                     />
                   </div>
                 </div>
               </div>
             </div>
           </details>
         );
       })}
     </CardContent>
   </Card>
      {/* Exam Report */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Submitted At:</strong> {submittedAt}</p>
          <p><strong>Total Questions:</strong> {exam.questions.length}</p>
<p><strong>Correct Answers:</strong> {correctCount}</p>
<p><strong>Incorrect Answers:</strong> {incorrectCount}</p>
<p><strong>Percentage:</strong> {submission.percentage.toFixed(1)}%</p>
          <p>
            <strong>Overall Remarks:</strong>{" "}
            {submission.grade === "F" ? "Needs Improvement" : "Good Job"}
          </p>
        </CardContent>
      </Card>

      {/* Teacher Feedback */}
      {submission.feedback && (
        <Card>
          <CardHeader>
            <CardTitle>Teacher Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert">{submission.feedback}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
