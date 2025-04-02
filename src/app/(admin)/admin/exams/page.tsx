"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AdminExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingExamId, setUpdatingExamId] = useState<string | null>(null);

  // For delete confirmation modal
  const [examToDelete, setExamToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch("/api/admin/exams", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch exams");
        const data = await res.json();
        // Ensure the API returns _count, e.g. via:
        // include: { subject: true, _count: { select: { questions: true, submissions: true } } }
        setExams(data.exams || []);
      } catch (err: any) {
        setError(err.message || "Error fetching exams");
      } finally {
        setLoading(false);
      }
    }
    fetchExams();
  }, []);

  const handleStatusChange = async (examId: string, newStatus: string) => {
    setUpdatingExamId(examId);
    try {
      const res = await fetch(`/api/admin/exams/${examId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update exam");
      const data = await res.json();
      setExams((prev) =>
        prev.map((exam) => (exam.id === examId ? data.exam : exam))
      );
      toast("Exam updated successfully!", {
        variant: "success",
        duration: 3000,
      });
    } catch (err: any) {
      toast(err.message || "Failed to update exam", {
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setUpdatingExamId(null);
    }
  };

  const handleDelete = async () => {
    if (!examToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/teacher/exams/${examToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete exam");
      toast("Exam deleted successfully!", {
        variant: "success",
        duration: 3000,
      });
      setExams((prev) =>
        prev.filter((exam) => exam.id !== examToDelete.id)
      );
      setExamToDelete(null);
    } catch (err: any) {
      toast(err.message || "Error deleting exam", {
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Exams</h1>
        {/* Uncomment if needed
        <Button asChild className="mt-4 sm:mt-0">
          <Link
            href="/admin/exams/create"
            className="px-4 py-2 rounded transition"
          >
            Create New Exam
          </Link>
        </Button>
        */}
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exams found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">
                    {exam.title}
                  </CardTitle>
                  <Badge
                    variant={exam.status === "DRAFT" ? "secondary" : "default"}
                  >
                    {exam.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade</span>
                  <span>{exam.gradeLevel} th</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subject</span>
                  <span>{exam.subject?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span>
                    {format(new Date(exam.scheduledAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span>{exam._count?.questions || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Submissions</span>
                  <span>{exam._count?.submissions || 0}</span>
                </div>
                <div className="mt-4">
                  <label className="block text-sm mb-1">Update Status:</label>
                  <Select
                    value={exam.status}
                    onValueChange={(value) =>
                      handleStatusChange(exam.id, value)
                    }
                    disabled={updatingExamId === exam.id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">DRAFT</SelectItem>
                      {/* <SelectItem value="SCHEDULED">SCHEDULED</SelectItem> */}
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      {/* <SelectItem value="COMPLETED">COMPLETED</SelectItem> */}
                      {/* <SelectItem value="ARCHIVED">ARCHIVED</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <div className="pt-0 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teacher/exams/${exam.id}/edit`}>Edit</Link>
                  </Button>
                  {exam._count?.submissions > 0 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/exams/${exam.id}/results`}>
                        Results
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setExamToDelete(exam)}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {examToDelete && (
        <Dialog open={true} onOpenChange={() => setExamToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Exam</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the exam{" "}
                <strong>{examToDelete.title}</strong>? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setExamToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
