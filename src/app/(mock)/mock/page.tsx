"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Loading } from "@/components/loading";

export default function MockExamsDashboard() {
  const [mockExams, setMockExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMockExams() {
      try {
        const res = await fetch("/api/student/exams/mock", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch mock exams");
        const data = await res.json();
        // Ensure we default to an empty array if data.mockExams is undefined
        setMockExams(data.mockExams || []);
      } catch (err: any) {
        console.error("Error fetching mock exams:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMockExams();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (mockExams.length === 0)
    return (
      <p className="p-6 text-center">No mock exams available at the moment.</p>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{exam.title}</CardTitle>
              <Badge>{exam.subject.name}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>{exam.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Scheduled:</span>
                <span>
                  {format(new Date(exam.scheduledAt), "MMM dd, yyyy HH:mm")}
                </span>
              </div>
            </CardContent>
            <div className="p-4">
              <Button className="w-full" asChild>
                <Link href={`/mock/${exam.id}/take`}>
                  Take Mock Exam
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
