"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ExamDetailsForm } from "./ExamDetailsForm";
import { ExamQuestionsForm } from "./ExamQuestionsForm";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import React from "react";

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
  // Sort the questions by order to ensure they load correctly.
  const sortedQuestions = exam.questions.sort((a, b) => a.order - b.order);

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
      questions: sortedQuestions,
    },
  });

  // useFieldArray for managing questions
  const { fields, append, remove, move } = useFieldArray({
    control: methods.control,
    name: "questions",
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Convert Date objects to ISO strings and compute maxScore
      const payload = {
        ...data,
        scheduledAt: data.scheduledAt.toISOString(),
        maxScore: data.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0),
      };

      const res = await fetch(`/api/teacher/exams/${exam.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update exam");
      }
      const responseData = await res.json();
      toast.success("Exam updated successfully!");
      router.push(responseData.redirectTo);
    } catch (error: any) {
      toast.error(error.message || "Failed to update exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Exam Details Form */}
        <ExamDetailsForm />

        {/* Pass the field array helpers and fields to ExamQuestionsForm */}
        <ExamQuestionsForm fields={fields} append={append} remove={remove} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Exam"}
        </Button>
      </form>
    </FormProvider>
  );
}
