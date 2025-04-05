"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Example types – adjust according to your schema
type Exam = {
  id: string;
  title: string;
  subject: { name: string };
  maxScore: number;
  passingScore: number;
  averageScore: number;
  topScore: number;
  topScorer?: { name: string };
  scoreDistribution: { range: string; count: number }[];
};

type Submission = {
  id: string;
  student: {
    id: string;
    displayName?: string;
    username?: string;
    email?: string;
  };
  totalScore: number;
  percentage: number;
  grade: string;
  status: string;
  submittedAt: string;
  gradedAt?: string;
};

type TeacherExamResultsClientProps = {
  exam: Exam;
  submissions: Submission[];
};

export default function TeacherExamResultsClient({
  exam,
  submissions,
}: TeacherExamResultsClientProps) {
  const router = useRouter();
  const params = useParams() as { id?: string };
  // Use exam.id if available; otherwise fallback to the dynamic parameter from the URL.
  const examId = exam?.id || params.id;

  // Helper to derive a student's display name
  const getStudentName = (student: Submission["student"]) =>
    student.displayName || student.username || student.email || "Unknown";

  const sortedSubmissions = [...submissions].sort(
    (a, b) => b.totalScore - a.totalScore
  );
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{exam.title} Results</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              out of {exam.maxScore}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              students attempted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.topScore}</div>
            <p className="text-xs text-muted-foreground">
              achieved by {exam.topScorer?.name || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exam.scoreDistribution}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Student Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <div className="grid grid-cols-7 gap-4 p-2 bg-muted/50 font-medium">
              <div>Student</div>
              <div>Score</div>
              <div>Percentage</div>
              <div>Grade</div>
              <div>Status</div>
              <div>Submitted At</div>
              <div>Details</div>
            </div>
            {sortedSubmissions.map((submission) => (
              <div key={submission.id} className="grid grid-cols-7 gap-4 p-2 border-t">
                <div>{getStudentName(submission.student)}</div>
                <div>{submission.totalScore.toFixed(1)}</div>
                <div>{submission.percentage.toFixed(1)}%</div>
                <div>
                  <Badge variant={submission.percentage >= exam.passingScore ? "success" : "destructive"}>
                    {submission.grade}
                  </Badge>
                </div>
                <div>
                  <Badge variant="outline">{submission.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </div>
                
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/teacher/exams/${examId}/results/${submission.student.id}`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
