"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuestionBuilder({ index }: { index: number }) {
  const { watch, setValue } = useFormContext();
  const question = watch(`questions.${index}`);

  // Ensure content is an object; if string, convert it immediately.
  let contentValue = "";
  if (typeof question.content === "object" && question.content !== null) {
    contentValue = question.content.text;
  } else if (typeof question.content === "string") {
    contentValue = question.content;
    setValue(`questions.${index}.content`, { text: contentValue });
  } else {
    contentValue = "";
  }

  const addOption = () => {
    setValue(`questions.${index}.options`, [...question.options, ""]);
  };

  return (
    <div className="p-6 border rounded-lg bg-background">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium">Question {index + 1}</h3>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            const currentQuestions = watch("questions");
            setValue("questions", currentQuestions.filter((_: any, i: number) => i !== index));
          }}
        >
          <Trash className="w-4 h-4 text-destructive" />
        </Button>
      </div>

      <Input
        placeholder="Enter question text..."
        value={contentValue}
        onChange={(e) => setValue(`questions.${index}.content`, { text: e.target.value })}
        className="mb-4"
      />

      <div className="space-y-2">
        {question.options.map((_: string, optionIndex: number) => (
          <div key={optionIndex} className="flex items-center gap-2">
            <Switch
              checked={question.correctAnswer?.includes(optionIndex.toString()) || false}
              onCheckedChange={(checked) => {
                const answers = checked
                  ? [...(question.correctAnswer || []), optionIndex.toString()]
                  : (question.correctAnswer || []).filter((i: string) => i !== optionIndex.toString());
                setValue(`questions.${index}.correctAnswer`, answers);
              }}
            />
            <Input
              value={question.options[optionIndex] || ""}
              onChange={(e) => {
                const newOptions = [...question.options];
                newOptions[optionIndex] = e.target.value;
                setValue(`questions.${index}.options`, newOptions);
              }}
              placeholder={`Option ${optionIndex + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          Add Option
        </Button>
        <Input
          type="number"
          className="w-20"
          min="1"
          value={question.points || 1}
          onChange={(e) => setValue(`questions.${index}.points`, Number(e.target.value))}
        />
      </div>
    </div>
  );
}
