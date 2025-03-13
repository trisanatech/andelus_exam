"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flag, FlagOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Loading from "./loading";
import InstructionModal from "./InstructionModal";
import ConfirmSubmitModal from "./ConfirmSubmitModal";

export default function MockExamPage() {
  const router = useRouter();
  const { id } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Modal state
  const [showInstructionModal, setShowInstructionModal] = useState(true);
  const [examCodeInput, setExamCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer warnings using refs to avoid re-render resetting the timer
  const tenMinuteWarnedRef = useRef(false);
  const twoMinuteWarnedRef = useRef(false);

  // Fetch exam data (mock exam)
  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`/api/student/exams/mock/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch exam");
        const data = await res.json();
        setExam(data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    }
    if (id) fetchExam();
  }, [id]);

  // Start timer when exam is loaded and instruction modal is closed
  useEffect(() => {
    if (exam && !showInstructionModal) {
      const totalSeconds = exam.duration * 60;
      setTimeLeft(totalSeconds);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast("Time is up! Auto-submitting your exam.", { variant: "warning", duration: 3000 });
            handleSubmit(true); // auto-submit without confirmation
            return 0;
          }
          if (!tenMinuteWarnedRef.current && prev <= 10 * 60) {
            toast("Warning: Only 10 minutes remaining!", { variant: "warning", duration: 3000 });
            tenMinuteWarnedRef.current = true;
          }
          if (!twoMinuteWarnedRef.current && prev <= 2 * 60) {
            toast("Last warning: Only 2 minutes remaining!", { variant: "warning", duration: 3000 });
            twoMinuteWarnedRef.current = true;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [exam, showInstructionModal]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const newFlags = new Set(prev);
      if (newFlags.has(currentQuestion)) {
        newFlags.delete(currentQuestion);
      } else {
        newFlags.add(currentQuestion);
      }
      return newFlags;
    });
  };

  const handleAnswer = (value: string) => {
    if (!exam) return;
    setAnswers((prev) => {
      const newAns = { ...prev, [exam.questions[currentQuestion].id]: value };
      return newAns;
    });
  };

  // Compute result locally without storing it
  const computeResult = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    for (const question of exam.questions) {
      const studentAnswer = answers[question.id];
      const correctAnswer = Array.isArray(question.correctAnswer)
        ? question.correctAnswer[0]
        : question.correctAnswer;
      if (String(studentAnswer).trim() === String(correctAnswer).trim()) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
    const totalScore = correctCount;
    const maxScore = exam.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);
    const percentage = (totalScore / maxScore) * 100;
    return { correctCount, incorrectCount, totalScore, maxScore, percentage };
  };

  // Handle submission: if autoSubmit is true, bypass confirmation.
  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && timeLeft > 0 && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }
    const result = computeResult();
    // Instead of sending to a server, we simply display the result on this page.
    setResult(result);
  };

  // State for displaying result locally
  const [result, setResult] = useState<any>(null);

  // Handler for "Begin Exam" from InstructionModal: check exam code (client-side check)
  const handleBeginExam = () => {
    if (exam && exam.examCode && examCodeInput === exam.examCode) {
      setShowInstructionModal(false);
      setCodeError("");
    } else {
      setCodeError("Invalid exam code. Please try again.");
    }
  };

  const handleCancelInstruction = () => {
    router.push("/student/dashboard");
  };

  const confirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  if (!exam) return <Loading />;

  if (result) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">{exam.title} - Mock Exam Result</h1>
        <div className="grid grid-cols-1 gap-4">
          <p className="text-sm">
            Score: {result.totalScore} / {result.maxScore} (
            {result.percentage.toFixed(1)}%)
          </p>
          <p className="text-sm">Correct: {result.correctCount}</p>
          <p className="text-sm">Incorrect: {result.incorrectCount}</p>
        </div>
        <Button onClick={() => router.push("/student/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 h-screen">
      {/* Instruction Modal */}
      {showInstructionModal && exam && (
        <InstructionModal
          examCodeInput={examCodeInput}
          setExamCodeInput={setExamCodeInput}
          onBegin={handleBeginExam}
          onCancel={handleCancelInstruction}
          codeError={codeError}
          examTitle={exam.title}
          examInstructions={exam.instructions}
          examDuration={exam.duration}
          examScheduledAt={exam.scheduledAt}
        />
      )}
      {/* Confirm Submit Modal */}
      {showConfirmModal && (
        <ConfirmSubmitModal
          open={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={cancelSubmit}
        />
      )}
      {/* Main Exam Area */}
      <div className="col-span-3 flex flex-col p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">{exam.subject?.name}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-medium">
              Time Remaining: {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            <Badge variant="outline" className="mt-1">
              Question {currentQuestion + 1} of {exam.questions.length}
            </Badge>
          </div>
        </div>
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>
                {typeof exam.questions[currentQuestion].content === "object"
                  ? exam.questions[currentQuestion].content.text
                  : exam.questions[currentQuestion].content}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={toggleFlag}>
                {flaggedQuestions.has(currentQuestion) ? (
                  <>
                    <FlagOff className="w-4 h-4 mr-2" /> Unflag
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4 mr-2" /> Flag
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[exam.questions[currentQuestion].id] || ""}
              onValueChange={handleAnswer}
            >
              {exam.questions[currentQuestion].options.map(
                (option: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {typeof option === "object" ? option.text : option}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion((p) => Math.max(0, p - 1))
              }
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion((p) =>
                  Math.min(exam.questions.length - 1, p + 1)
                )
              }
              disabled={currentQuestion === exam.questions.length - 1}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              if (timeLeft === 0) {
                handleSubmit(true);
              } else {
                if (
                  window.confirm(
                    "Are you sure you want to submit your exam? Once submitted, you cannot change your answers."
                  )
                ) {
                  handleSubmit();
                }
              }
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Exam"}
          </Button>
        </div>
      </div>
      <div className="col-span-1 border-l p-4 space-y-4">
        <h3 className="text-lg font-semibold">Questions</h3>
        <div className="grid grid-cols-5 gap-2">
          {exam.questions.map((_: any, index: number) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 relative",
                currentQuestion === index && "border-2 border-primary",
                answers[exam.questions[index].id] && "bg-primary/20",
                flaggedQuestions.has(index) && "bg-yellow-100 border-yellow-400"
              )}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
              {flaggedQuestions.has(index) && (
                <span className="absolute top-0 right-0 text-yellow-500">•</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
