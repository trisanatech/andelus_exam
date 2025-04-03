"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import InstructionModal from "./components/InstructionModal";
import ConfirmSubmitModal from "./components/ConfirmSubmitModal";
import { useVisibilityWarning } from "./components/useVisibilityWarning";
import { SafeHTMLWithMath } from "./components/SafeHTMLWithMath";

export default function TakeExamPage() {
  const router = useRouter();
  const { id } = useParams();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answersRef = useRef(answers);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isSubmittingRef = useRef(false);

  // Modal states
  const [showInstructionModal, setShowInstructionModal] = useState(true);
  const [examCodeInput, setExamCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer & exam state
  const [exam, setExam] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tenMinuteWarnedRef = useRef(false);
  const twoMinuteWarnedRef = useRef(false);

  // Monitor visibility/focus
  useVisibilityWarning();

  // Keep answersRef in sync with answers state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // --- Local Auto-Save ---
  useEffect(() => {
    if (exam) {
      localStorage.setItem(`exam-${exam.id}-answers`, JSON.stringify(answers));
    }
  }, [answers, exam]);

  // --- Connectivity Monitoring & Background Sync ---
  const syncPendingSubmission = useCallback(async () => {
    const pendingSubmission = localStorage.getItem("pendingExamSubmission");
    if (pendingSubmission) {
      try {
        const submissionData = JSON.parse(pendingSubmission);
        const res = await fetch(`/api/student/exams/${submissionData.examId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });
        if (res.ok) {
          toast("Pending exam submission synced successfully!", {
            variant: "success",
            duration: 5000,
          });
          localStorage.removeItem("pendingExamSubmission");
          router.push(`/student/exams/${submissionData.examId}/result`);
        }
      } catch (error) {
        console.error("Error syncing pending submission:", error);
      }
    }
  }, [router]);

  useEffect(() => {
    const handleOnline = () => {
      // Only show toast if there's a pending submission
      if (localStorage.getItem("pendingExamSubmission")) {
        toast("Back online. Attempting to sync exam data...", {
          variant: "success",
          duration: 5000,
        });
      }
      syncPendingSubmission();
    };

    const handleOffline = () => {
      toast("You are offline. Your progress is saved locally.", {
        variant: "warning",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncPendingSubmission]);

  // --- Fetch exam data from API and sort questions by order ---
  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`/api/student/exams/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch exam");
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions)) {
          data.questions = data.questions.sort((a: any, b: any) => a.order - b.order);
        }
        setExam(data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    }
    if (id) fetchExam();
  }, [id]);

  // --- Timer: Start timer when exam is loaded, instructions are dismissed, and exam is not submitted ---
  useEffect(() => {
    if (exam && !showInstructionModal && !submitted) {
      const totalSeconds = exam.duration * 60;
      setTimeLeft(totalSeconds);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            toast("Time is up! Auto-submitting your exam.", {
              duration: 5000,
              style: { backgroundColor: "#DC2626", color: "white" },
            });
            // Use latest answers from the ref in auto submission
            handleSubmit(true);
            return 0;
          }
          if (!tenMinuteWarnedRef.current && prev <= 10 * 60) {
            toast("Warning: Only 10 minutes remaining!", {
              duration: 5000,
              style: { backgroundColor: "#DC2626", color: "white" },
            });
            tenMinuteWarnedRef.current = true;
          }
          if (!twoMinuteWarnedRef.current && prev <= 2 * 60) {
            toast("Last warning: Only 2 minutes remaining!", {
              duration: 5000,
              style: { backgroundColor: "#DC2626", color: "white" },
            });
            twoMinuteWarnedRef.current = true;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [exam, showInstructionModal, submitted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }

  const toggleFlag = () => {
    if (submitted) return; // Prevent flag toggling after submission
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
    if (!exam || submitted) return;
    setAnswers((prev) => {
      const newAns = { ...prev, [exam.questions[currentQuestion].id]: value };
      console.log("Updated Answers:", newAns);
      return newAns;
    });
  };

  // --- Submission Handler ---
  const handleSubmit = async (autoSubmit = false) => {
    // Prevent double submission
    if (submitted || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    // If not auto-submitting and exam is still running, show confirm modal
    if (!autoSubmit && timeLeft > 0 && !showConfirmModal) {
      setShowConfirmModal(true);
      isSubmittingRef.current = false;
      return;
    }
    // Stop the timer
    if (timerRef.current) clearInterval(timerRef.current);

    const submissionPayload = {
      examId: id,
      answers: Object.entries(answersRef.current).map(([questionId, answer]) => ({
        [questionId]: answer,
      })),
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/student/exams/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      });
      if (!res.ok) throw new Error("Failed to submit exam");
      toast("Exam submitted successfully!", {
        variant: "success",
        duration: 5000,
      });
      localStorage.removeItem("pendingExamSubmission");
      setSubmitted(true);
      // Redirect after a brief delay.
      setTimeout(() => {
        router.push(`/student/exams/${id}/result`);
      }, 2000);
    } catch (error) {
      toast("Submission failed. Your exam will be re-synced when offline.", {
        variant: "destructive",
        duration: 5000,
      });
      localStorage.setItem("pendingExamSubmission", JSON.stringify(submissionPayload));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Instruction Modal Handlers ---
  const handleBeginExam = () => {
    if (exam && exam.examCode && examCodeInput === exam.examCode) {
      requestFullscreen();
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

  return (
    <>
      {/* Modal overlay shown when submitted */}
      {submitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">Exam Submitted</h2>
            <p>please Do NOT navigate to other pages until it loads by itself!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 h-screen">
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

        {showConfirmModal && (
          <ConfirmSubmitModal
            open={showConfirmModal}
            onConfirm={confirmSubmit}
            onCancel={cancelSubmit}
          />
        )}
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
          <Card className="flex-1 relative">
            <CardHeader className="pb-3 relative">
              <CardTitle>
                <SafeHTMLWithMath
                  html={
                    typeof exam.questions[currentQuestion].content === "object"
                      ? exam.questions[currentQuestion].content.text
                      : exam.questions[currentQuestion].content
                  }
                />
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFlag}
                className="absolute top-5 right-5"
                disabled={submitted}
              >
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
            </CardHeader>
            <CardContent className="space-y-4">
              <hr className="border-t border-gray-300" />
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
                        disabled={submitted}
                      />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        <SafeHTMLWithMath
                          html={
                            typeof option === "object" ? option.text : option
                          }
                        />
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
                disabled={currentQuestion === 0 || submitted}
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
                disabled={currentQuestion === exam.questions.length - 1 || submitted}
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
                  setShowConfirmModal(true);
                }
              }}
              disabled={loading || submitted}
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
                disabled={submitted}
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
    </>
  );
}
