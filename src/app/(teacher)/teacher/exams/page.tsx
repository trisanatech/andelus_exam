import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getExams } from "@/actions/exam";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  <Badge
                    variant={exam.status === "DRAFT" ? "secondary" : "default"}
                  >
                    {exam.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade</span>
                  <span>{exam.gradeLevel} th</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subject</span>
                  <span>{exam.subject.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span>
                    {format(new Date(exam.scheduledAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span>{exam._count.questions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Submissions</span>
                  <span>{exam._count.submissions}</span>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teacher/exams/${exam.id}/edit`}>Edit</Link>
                  </Button>
                  {/* {exam.status === "ACTIVE" &&
                    exam._count.submissions > 0 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teacher/exams/${exam.id}/results`}>
                          Results
                        </Link>
                      </Button>
                    )} */}
                  {exam._count.submissions > 0 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teacher/exams/${exam.id}/results`}>
                          Results
                        </Link>
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
