// ExamsPage.tsx (Server Component)
import { getExams } from "@/actions/exam";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ExamCard from "./ExamCard";

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Exams</h1>
        <Button asChild>
          <Link href="/teacher/exams/create">Create New Exam</Link>
        </Button>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exams created yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
