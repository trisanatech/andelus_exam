"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import { QuestionBuilder } from "./QuestionBuilder";
import { Plus } from "lucide-react";
import { UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

type ExamQuestionsFormProps = {
  fields: any[];
  append: UseFieldArrayAppend<any>;
  remove: UseFieldArrayRemove;
};

export function ExamQuestionsForm({ fields, append, remove }: ExamQuestionsFormProps) {
  const addQuestion = () => {
    append({
      id: "", // new questions will not have an id yet
      order: fields.length + 1,
      content: { text: "<p>Enter question text here...</p>" },
      options: [
        { text: "<p>Option 1</p>" },
        { text: "<p>Option 2</p>" },
        { text: "<p>Option 3</p>" },
        { text: "<p>Option 4</p>" },
      ],
      // Set the first option as the default correct answer (using the option index as a string)
      correctAnswer: ["0"],
      points: 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => (
          // Using a stable key (preferably the field id if available)
          <QuestionBuilder key={field.id || index} index={index} removeQuestion={() => remove(index)} />
        ))}
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={addQuestion}>
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
}
