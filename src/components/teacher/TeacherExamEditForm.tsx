"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
// import { ExamDetailsForm } from "./exam-details-form";
// import { ExamQuestionsForm } from "./exam-questions-form";
import { ExamDetailsForm } from "./ExamDetailsForm";
import { ExamQuestionsForm } from "./ExamQuestionsForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Exam = {
  id: string;
  title: string;
  subjectId: string;
  gradeLevel: string;
  duration: number;
  scheduledAt: Date;
  instructions?: string;
  shuffleOptions: boolean;
  randomizeOrder: boolean;
  passingScore?: number;
  isMock: boolean;
  examCode: string;
  questions: any[];
};

type TeacherExamEditFormProps = {
  exam: Exam;
};

export default function TeacherExamEditForm({ exam }: TeacherExamEditFormProps) {
  // Initialize react-hook-form with default values, including exam questions.
  const methods = useForm({
    defaultValues: {
      title: exam.title,
      subjectId: exam.subjectId,
      gradeLevel: exam.gradeLevel,
      duration: exam.duration,
      scheduledAt: new Date(exam.scheduledAt),
      instructions: exam.instructions,
      shuffleOptions: exam.shuffleOptions,
      randomizeOrder: exam.randomizeOrder,
      passingScore: exam.passingScore,
      isMock: exam.isMock,
      examCode: exam.examCode,
      questions: exam.questions, // Pre-populate with existing questions
    },
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Convert Date objects to ISO strings
      const payload = {
        ...data,
        scheduledAt: data.scheduledAt.toISOString(),
      };

      const res = await fetch(`/api/teacher/exams/${exam.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update exam");
      }
      toast.success("Exam updated successfully!");
      router.push("/teacher/exams");
    } catch (error: any) {
      toast.error(error.message || "Failed to update exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Exam Details Form (title, subject, etc.) */}
        <ExamDetailsForm />
        {/* Exam Questions Form to edit questions */}
        <ExamQuestionsForm />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Exam"}
        </Button>
      </form>
    </FormProvider>
  );
}
