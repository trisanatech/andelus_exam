// "use client";

// import { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// // import { useExamTimer } from "@/hooks/use-exam-timer";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Flag, FlagOff } from "lucide-react";
// // import { submitExam } from "@/actions/exam";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import Loading from "./loading"; // Import your Loading skeleton component

// export default function TakeExamPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
//     new Set()
//   );
//   const [loading, setLoading] = useState(false);

//   // Extract exam id from params
//   const { id } = use(params);

//   // Local state for exam data and timer (in seconds)
//   const [exam, setExam] = useState<any>(null);
//   const [timeLeft, setTimeLeft] = useState(0);

//   // Fetch exam data from your API endpoint
//   useEffect(() => {
//     async function fetchExam() {
//       try {
//         const res = await fetch(`/api/student/exams/${id}`, {
//           cache: "no-store",
//         });
//         if (!res.ok) throw new Error("Failed to fetch exam");
//         const data = await res.json();
//         setExam(data);
//       } catch (error) {
//         console.error("Error fetching exam:", error);
//       }
//     }
//     fetchExam();
//   }, [id]);

//   // Timer logic using exam.duration only (in minutes)
//   useEffect(() => {
//     if (exam) {
//       const totalSeconds = exam.duration * 60;
//       setTimeLeft(totalSeconds);
//       const interval = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [exam]);

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   const toggleFlag = () => {
//     setFlaggedQuestions((prev) => {
//       const newFlags = new Set(prev);
//       if (newFlags.has(currentQuestion)) {
//         newFlags.delete(currentQuestion);
//       } else {
//         newFlags.add(currentQuestion);
//       }
//       return newFlags;
//     });
//   };

//   const handleAnswer = (value: string) => {
//     if (!exam) return;
//     setAnswers((prev) => {
//       const newAnswers = {
//         ...prev,
//         [exam.questions[currentQuestion].id]: value,
//       };
//       console.log("Updated Answers:", newAnswers);
//       return newAnswers;
//     });
//   };

//   // const handleSubmit = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const res = await fetch(`/api/student/exams/${id}/submit`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         answers: Object.entries(answers).map(([questionId, answer]) => ({
//   //           questionId,
//   //           answer,
//   //         })),
//   //       }),
//   //     });

//   //     const data = await res.json();
//   //     if (!res.ok) throw new Error(data.error || "Submission failed");

//   //     toast.success("Exam submitted successfully!");
//   //     router.push(`/student/exams/${id}/result`);
//   //   } catch (error) {
//   //     toast.error(error.message || "Failed to submit exam. Please try again.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/student/exams/${id}/submit`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           examId: id,
//           answers: Object.entries(answers).map(([questionId, answer]) => ({
//             [questionId]: answer,
//           })),
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to submit exam");

//       toast.success("Exam submitted successfully!");
//       router.push(`/student/exams/${id}/result`);
//     } catch (error) {
//       toast.error("Failed to submit exam. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!exam) return <Loading />;

//   return (
//     <div className="grid grid-cols-4 h-screen">

//       {/* Main Exam Area */}
//       <div className="col-span-3 flex flex-col p-6">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">{exam.title}</h1>
//             <p className="text-muted-foreground">{exam.subject?.name}</p>
//           </div>
//           <div className="text-right">
//             <div className="text-xl font-medium">
//               Time Remaining: {minutes}:{seconds.toString().padStart(2, "0")}
//             </div>
//             <Badge variant="outline" className="mt-1">
//               Question {currentQuestion + 1} of {exam.questions.length}
//             </Badge>
//           </div>
//         </div>

//         {/* Question Content */}
//         <Card className="flex-1">
//           <CardHeader className="pb-3">
//             <div className="flex justify-between items-center">
//               <CardTitle>
//                 {typeof exam.questions[currentQuestion].content === "object"
//                   ? exam.questions[currentQuestion].content.text
//                   : exam.questions[currentQuestion].content}
//               </CardTitle>
//               <Button variant="ghost" size="sm" onClick={toggleFlag}>
//                 {flaggedQuestions.has(currentQuestion) ? (
//                   <>
//                     <FlagOff className="w-4 h-4 mr-2" /> Unflag
//                   </>
//                 ) : (
//                   <>
//                     <Flag className="w-4 h-4 mr-2" /> Flag
//                   </>
//                 )}
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <RadioGroup
//               value={answers[exam.questions[currentQuestion].id] || ""}
//               onValueChange={handleAnswer}
//             >
//               {exam.questions[currentQuestion].options.map(
//                 (option: any, index: number) => (
//                   <div
//                     key={index}
//                     className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
//                   >
//                     <RadioGroupItem
//                       value={index.toString()}
//                       id={`option-${index}`}
//                     />
//                     <Label
//                       htmlFor={`option-${index}`}
//                       className="flex-1 cursor-pointer"
//                     >
//                       {typeof option === "object" ? option.text : option}
//                     </Label>
//                   </div>
//                 )
//               )}
//             </RadioGroup>
//           </CardContent>

//           {/* Navigation */}
//           <CardFooter className="flex justify-between pt-4">
//             <Button
//               variant="outline"
//               onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
//               disabled={currentQuestion === 0}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() =>
//                 setCurrentQuestion((p) =>
//                   Math.min(exam.questions.length - 1, p + 1)
//                 )
//               }
//               disabled={currentQuestion === exam.questions.length - 1}
//             >
//               Next
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* Submit Button */}
//         <div className="mt-4">
//           <Button
//             className="w-full"
//             size="lg"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit Exam"}
//           </Button>
//         </div>
//       </div>

//        {/* Questions List */}
//        <div className="col-span-1 border-l p-4 space-y-4">
//         <h3 className="text-lg font-semibold">Questions</h3>
//         <div className="grid grid-cols-5 gap-2">
//           {exam.questions.map((_: any, index: number) => (
//             <Button
//               key={index}
//               variant="outline"
//               size="sm"
//               className={cn(
//                 "h-10 w-10 p-0 relative",
//                 currentQuestion === index && "border-2 border-primary",
//                 answers[exam.questions[index].id] && "bg-primary/20",
//                 flaggedQuestions.has(index) && "bg-yellow-100 border-yellow-400"
//               )}
//               onClick={() => setCurrentQuestion(index)}
//             >
//               {index + 1}
//               {flaggedQuestions.has(index) && (
//                 <span className="absolute top-0 right-0 text-yellow-500">
//                   •
//                 </span>
//               )}
//             </Button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

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
import InstructionModal from "./components/InstructionModal";
import ConfirmSubmitModal from "./components/ConfirmSubmitModal";
import { useVisibilityWarning } from "./components/useVisibilityWarning";
import { SafeHTMLWithMath } from "./components/SafeHTMLWithMath";

export default function TakeExamPage() {
  const router = useRouter();
  const { id } = useParams();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showInstructionModal, setShowInstructionModal] = useState(true);
  const [examCodeInput, setExamCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer & exam state
  const [exam, setExam] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const tenMinuteWarnedRef = useRef(false);
  const twoMinuteWarnedRef = useRef(false);

  // Monitor visibility/focus
  useVisibilityWarning();

  // Fetch exam data from API and sort questions by order
  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`/api/student/exams/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch exam");
        const data = await res.json();
        // Sort the questions array by the 'order' field in ascending order.
        if (data.questions && Array.isArray(data.questions)) {
          data.questions = data.questions.sort(
            (a: any, b: any) => a.order - b.order
          );
        }
        setExam(data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    }
    if (id) fetchExam();
  }, [id]);

  // Start timer when exam is loaded and instructions are dismissed
  useEffect(() => {
    if (exam && !showInstructionModal) {
      const totalSeconds = exam.duration * 60;
      setTimeLeft(totalSeconds);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast("Time is up! Auto-submitting your exam.", {
              duration: 3000,
              style: { backgroundColor: "#DC2626", color: "white" },
            });
            handleSubmit(true); // auto-submit with no confirmation
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
              style: { backgroundColor: "#DC2626", color: "white" },
              duration: 5000,
            });
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
      console.log("Updated Answers:", newAns);
      return newAns;
    });
  };

  // Submission handler (autoSubmit bypasses confirmation)
  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && timeLeft > 0 && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/student/exams/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: id,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            [questionId]: answer,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit exam");
      toast("Exam submitted successfully!", {
        variant: "success",
        duration: 3000,
      });
      router.push(`/student/exams/${id}/result`);
    } catch (error) {
      toast("Failed to submit exam. Please try again.", {
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // When the student clicks "Begin Exam" in the instruction modal
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
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
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
                setShowConfirmModal(true);
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
                <span className="absolute top-0 right-0 text-yellow-500">
                  •
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

