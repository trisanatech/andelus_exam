"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { SafeHTMLWithMath } from "./SafeHTMLWithMath"; // Import the component

export function ExamReview() {
  const { watch } = useFormContext();
  const exam = watch() || {};

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
              <p className="font-medium">{exam.title || "No title provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scheduled At</p>
              <p className="font-medium">
                {exam.scheduledAt ? format(new Date(exam.scheduledAt), "PPPp") : "Not scheduled"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {exam.duration ? exam.duration + " minutes" : "Not specified"}
              </p>
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
            {exam.questions && exam.questions.length > 0 ? (
              exam.questions.map((question: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg">
                  <p className="font-medium">Question {index + 1}</p>
                  <div className="text-sm text-muted-foreground prose max-w-none">
                    <SafeHTMLWithMath 
                      html={
                        (typeof question.content === "object" && question.content !== null
                          ? question.content.text
                          : question.content) || ""
                      }
                    />
                  </div>
                  <div className="mt-2 space-y-2">
                    {question.options && question.options.length > 0 ? (
                      question.options.map((option: any, optionIndex: number) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={question.correctAnswer?.includes(optionIndex.toString()) || false}
                            readOnly
                            className="w-4 h-4"
                          />
                          <div className="prose max-w-none">
                            <SafeHTMLWithMath html={option.text || ""} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No options provided.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No questions added.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}