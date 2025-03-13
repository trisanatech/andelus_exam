"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/loading";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch("/api/student/exams/availableExams", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch available exams");
        }
        const data = await res.json();
        setAvailableExams(data.availableExams);
      } catch (error) {
        console.error("Error fetching available exams:", error);
      } finally {
        setLoading(false);
      }
    }
    // Only fetch if session is loaded and authenticated
    if (status === "authenticated") {
      fetchExams();
    }
  }, [status]);

  if (status === "loading" || loading) return <Loading />;
  if (status !== "authenticated")
    return <p>Please log in to see available exams.</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Available Exams</h1>
      {availableExams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No exams available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{exam.title}</CardTitle>
                <Badge>{exam.subject.name}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span>
                    {format(new Date(exam.scheduledAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link href={`/student/exams/${exam.id}/take`}>
                      Start Exam
                    </Link>
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
