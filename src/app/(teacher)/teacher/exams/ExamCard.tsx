// ExamCard.tsx (Client Component)
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Exam = {
  id: string;
  title: string;
  status: string;
  gradeLevel: string;
  subject: { name: string };
  scheduledAt: string;
  _count: { questions: number; submissions: number };
};

export default function ExamCard({ exam }: { exam: Exam }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/exams/${exam.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete exam");
      toast.success("Exam deleted successfully!");
      // Optionally, update your local state or re-fetch data.
      // Here we simply reload the page.
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Error deleting exam.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{exam.title}</CardTitle>
            <Badge variant={exam.status === "DRAFT" ? "secondary" : "default"}>
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
            <span>{format(new Date(exam.scheduledAt), "MMM dd, yyyy HH:mm")}</span>
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
            {exam._count.submissions > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/teacher/exams/${exam.id}/results`}>Results</Link>
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the exam <strong>{exam.title}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
