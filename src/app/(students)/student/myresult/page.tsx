"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Loading } from "@/components/loading";

export default function MyExamResultsPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch("/api/student/exams/submitted", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch submitted exams");
        }
        const data = await res.json();
        setSubmissions(data.submissions);
      } catch (error: any) {
        console.error("Error fetching submitted exams:", error);
        setError(error.message || "Failed to fetch submitted exams");
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchResults();
    }
  }, [status]);

  if (status === "loading" || loading) return <Loading />;
  if (!session || status !== "authenticated") return <p>Please log in to view your exam results.</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Exam Results</h1>
      {error && <p className="text-red-500">{error}</p>}
      {submissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>You haven't taken any exams yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{submission.exam.title}</CardTitle>
                <Badge variant="secondary">{submission.exam.subject.name}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Score</span>
                  <span>{submission.score ?? "Pending"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Submitted At</span>
                  <span>
                    {submission.submittedAt
                      ? format(new Date(submission.submittedAt), "MMM dd, yyyy HH:mm")
                      : "Not submitted"}
                  </span>
                </div>
                <div className="pt-4">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/student/exams/${submission.exam.id}/result`}>View Result</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
