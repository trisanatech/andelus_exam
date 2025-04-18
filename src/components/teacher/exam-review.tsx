"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export function ExamReview() {
  const { watch } = useFormContext();
  const exam = watch();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{exam.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scheduled At</p>
              <p className="font-medium">
                {format(new Date(exam.scheduledAt), "PPPp")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{exam.duration} minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exam.questions.map((question: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg">
                <p className="font-medium">Question {index + 1}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof question.content === "object"
                    ? question.content.text
                    : question.content}
                </p>
                <div className="mt-2 space-y-2">
                  {question.options.map((option: string, optionIndex: number) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={question.correctAnswer.includes(optionIndex.toString())}
                        readOnly
                        className="w-4 h-4"
                      />
                      <p>{option}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
