"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import { useState } from "react";

type Exam = {
  title: string;
  maxScore: number;
  averageScore: number;
  passRate: number;
  passingScore: number;
  topScore: number;
  topScorer?: { name: string };
  scoreDistribution: { range: string; count: number }[];
  questions: any[];
};

type Submission = {
  id: string;
  student: {
    id: string;
    displayName?: string;
    username?: string;
    email: string;
  };
  totalScore: number;
  percentage: number;
  grade: string;
  status: string;
  submittedAt: string;
  gradedAt?: string;
  feedback?: string;
};

type TeacherExamResultsClientProps = {
  exam: Exam;
  submissions: Submission[];
};

export default function TeacherExamResultsClient({
  exam,
  submissions,
}: TeacherExamResultsClientProps) {
  // Helper to derive the student's name
  const getStudentName = (student: Submission["student"]) =>
    student.displayName || student.username || student.email || "Unknown";

  // State for toggling detailed feedback per submission
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">out of {exam.maxScore}</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.passRate}%</div>
            <p className="text-xs text-muted-foreground">passing at {exam.passingScore}+</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">students attempted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.topScore}</div>
            <p className="text-xs text-muted-foreground">achieved by {exam.topScorer?.name || "N/A"}</p>
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
              <div>Graded At</div>
            </div>
            {submissions.map((submission) => (
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
                <div className="text-sm text-muted-foreground">
                  {submission.gradedAt ? new Date(submission.gradedAt).toLocaleDateString() : "Pending"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback Section (Expandable per Student) */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.map((submission) => (
            <div key={submission.id} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{getStudentName(submission.student)}</div>
                <Button variant="link" onClick={() => toggleExpand(submission.id)}>
                  {expandedIds.has(submission.id) ? "Hide Feedback" : "Show Feedback"}
                </Button>
              </div>
              {expandedIds.has(submission.id) ? (
                submission.feedback ? (
                  <div className="prose dark:prose-invert">{submission.feedback}</div>
                ) : (
                  <p className="text-sm text-muted-foreground">No feedback provided.</p>
                )
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
