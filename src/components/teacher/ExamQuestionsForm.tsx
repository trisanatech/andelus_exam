"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { QuestionBuilder } from "./QuestionBuilder";
import { Plus } from "lucide-react";

export function ExamQuestionsForm() {
  const { watch, setValue } = useFormContext();
  const questions = watch("questions") || [];

  const addQuestion = () => {
    setValue("questions", [
      ...questions,
      {
        content: { text: "<p>Enter question text here...</p>" },
        options: [
          { text: "<p>Option 1</p>" },
          { text: "<p>Option 2</p>" },
        ],
        // Set the first option as the default correct answer
        correctAnswer: ["0"],
        points: 1,
      },
    ]);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {questions.map((_: unknown, index: number) => (
          <QuestionBuilder key={index} index={index} />
        ))}
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={addQuestion}>
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
}
