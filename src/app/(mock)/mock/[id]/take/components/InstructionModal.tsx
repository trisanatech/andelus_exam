"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type InstructionModalProps = {
  examCodeInput: string;
  setExamCodeInput: (val: string) => void;
  onBegin: () => void;
  onCancel: () => void;
  codeError: string;
  examTitle: string;
  examInstructions?: string;
  examDuration: number; // in minutes
  examScheduledAt: string;
  examCode: string;
};

export default function InstructionModal({
  examCodeInput,
  setExamCodeInput,
  onBegin,
  onCancel,
  codeError,
  examTitle,
  examInstructions,
  examDuration,
  examScheduledAt,
  examCode,
}: InstructionModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full",
          "text-gray-900 dark:text-gray-100"
        )}
      >
        <h2 className="text-xl font-bold mb-4">Exam Instructions</h2>
        {/* Exam Info */}
        <div className="mb-4">
          <p className="text-lg font-semibold">{examTitle}</p>
          <p className="text-sm">
            Duration: {examDuration} minutes
          </p>
          <p className="text-sm">
            Scheduled: {format(new Date(examScheduledAt), "PPPp")}
          </p>
          {examInstructions && (
            <p className="text-sm mt-2">{examInstructions}</p>
          )}
        </div>
        <p className="mb-4">
          Please read the following instructions carefully before starting your exam:
        </p>
        <ul className="list-disc list-inside text-sm mb-4">
          <li>Do not navigate away from this page.</li>
          <li>Answer all questions carefully.</li>
          <li>You will see a warning when less than 10 minutes remain.</li>
          <li>You will receive a final warning when less than 2 minutes remain.</li>
          <li>The exam will auto‑submit when time runs out.</li>
        </ul>
        <p className="mb-2 text-sm">
          Enter the exam code provided by your examiner:
        </p>
        <p className="mb-2 text-sm">
          Mcok Exam Code: <span className="font-semibold"> "{examCode}"</span>
        </p>
        <input
          type="text"
          value={examCodeInput}
          onChange={(e) => setExamCodeInput(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Exam code"
        />
        {codeError && (
          <p className="text-red-500 text-sm mb-2">{codeError}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onBegin}>
            Begin Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
