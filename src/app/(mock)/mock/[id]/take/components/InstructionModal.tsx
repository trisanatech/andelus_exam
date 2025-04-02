"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SafeHTMLWithMath } from "./SafeHTMLWithMath";

type InstructionModalProps = {
  examCodeInput: string;
  setExamCodeInput: (val: string) => void;
  onBegin: () => void;
  onCancel: () => void;
  codeError: string;
  examTitle: string;
  examInstructions?: string;
  examDuration: number;
  examScheduledAt: string;
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div
        className={cn(
          "bg-background text-foreground rounded-lg shadow-lg p-6 max-w-2xl w-[95%]",
          "flex flex-col max-h-[90vh] overflow-hidden"
        )}
      >
        {/* Header */}
        <h2 className="text-xl font-bold mb-4">Exam Instructions</h2>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Exam Info */}
          <div className="mb-4">
            <p className="text-lg font-semibold">{examTitle}</p>
            <div className="text-sm space-y-1 mt-2">
              <p>
                <span className="text-muted-foreground">Duration:</span>{" "}
                {examDuration} minutes
              </p>
              <p>
                <span className="text-muted-foreground">Scheduled:</span>{" "}
                {format(new Date(examScheduledAt), "PPPp")}
              </p>
            </div>
          </div>

          {/* Custom Instructions */}
          {examInstructions && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Specific Instructions:</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <SafeHTMLWithMath html={examInstructions} />
              </div>
            </div>
          )}

          {/* Default Instructions */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">General Instructions:</h3>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>Do not navigate away from this page during the exam</li>
              <li>Answer all questions within the allocated time</li>
              <li>You will receive warnings at 10 minutes and 2 minutes remaining</li>
              <li>The exam will automatically submit when time expires</li>
              <li>Ensure stable internet connection throughout the exam</li>
            </ul>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t pt-4 mt-4">
          <p className="text-sm mb-2 text-muted-foreground">
            Enter exam verification code:
          </p>
          <p className="mb-2 text-sm">
          Mcok Exam Code: <span className="font-semibold"> "{examCode}"</span>
        </p>
          <input
            type="text"
            value={examCodeInput}
            onChange={(e) => setExamCodeInput(e.target.value)}
            className={cn(
              "border-input bg-background ring-offset-background",
              "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            placeholder="Enter exam code"
          />
          {codeError && (
            <p className="text-destructive text-sm mt-1">{codeError}</p>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onBegin}>Begin Exam</Button>
          </div>
        </div>
      </div>
    </div>
  );
}