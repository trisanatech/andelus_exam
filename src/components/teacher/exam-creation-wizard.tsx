// "use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, FormProvider } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { ExamDetailsForm } from "./ExamDetailsForm";
// import { ExamQuestionsForm } from "./ExamQuestionsForm";
// import { ExamReview } from "./ExamReview";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// // Form schema: note that each question's content is stored as an object with a "text" property.
// const formSchema = z.object({
//   title: z.string().min(3, "Exam title must be at least 3 characters"),
//   subjectId: z.string().uuid("Please select a valid subject"),
//   duration: z.number().min(1, "Duration must be at least 1 minute"),
//   scheduledAt: z.date(),
//   instructions: z.string().optional(),
//   shuffleOptions: z.boolean(),
//   randomizeOrder: z.boolean(),
//   passingScore: z.number().optional(),
//   gradeLevel: z.string().min(1, "Grade level is required"),
//   questions: z
//     .array(
//       z.object({
//         content: z.object({
//           text: z
//             .string()
//             .min(5, "Question text must be at least 5 characters"),
//         }),
//         options: z
//           .array(z.string().min(1, "Each option must be provided"))
//           .min(2, "At least 2 options are required"),
//         correctAnswer: z
//           .array(z.string())
//           .min(1, "At least one correct answer is required"),
//         points: z.number().min(1, "Points must be at least 1"),
//       })
//     )
//     .min(1, "At least one question is required"),
// });

// export default function ExamCreationWizard({
//   onSuccess,
// }: {
//   onSuccess: (examId: string) => void;
// }) {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const { data: session } = useSession(); 

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       subjectId: "",
//       duration: 1,
//       scheduledAt: new Date(),
//       instructions: "",
//       shuffleOptions: false,
//       randomizeOrder: false,
//       passingScore: 0,
//       gradeLevel: "",
//       questions: [], // Start with no questions
//     },
//   });

//   // Prevent default form submission when clicking Next.
//   const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     console.log("Current Step:", step);
//     let isValid = false;
//     if (step === 1) {
//       isValid = await form.trigger([
//         "title",
//         "subjectId",
//         "duration",
//         "scheduledAt",
//         "gradeLevel",
//       ]);
//     } else if (step === 2) {
//       isValid = await form.trigger("questions");
//     } else {
//       isValid = true;
//     }
//     console.log("Validation Errors:", form.formState.errors);
//     if (isValid) {
//       console.log("Proceeding to next step");
//       setStep((currentStep) => currentStep + 1);
//     } else {
//       toast.error("Please fill out all required fields before proceeding.");
//     }
//   };

//   const handleSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setLoading(true);
//       if (!session || !session.user) {
//         throw new Error("User session not found");
//       }
//       const examData = {
//         ...values,
//         scheduledAt: values.scheduledAt.toISOString(),
//         teacherId: session.user.id, // Use logged-in teacher's id
//         maxScore: values.questions.reduce((sum, q) => sum + (q.points || 1), 0),
//       };

//       console.log("Final Payload:", JSON.stringify(examData, null, 2));

//       const res = await fetch(`/api/teacher/exams`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(examData),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to create exam");
//       }

//       const data = await res.json();
//       console.log("Exam created:", data);
//       onSuccess(data.exam.id);
//     } catch (error: any) {
//       console.error("Submission error:", error);
//       toast.error("Failed to create exam");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <FormProvider {...form}>
//       {/* A single form element wraps the entire wizard */}
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
//         <div className="flex gap-4 mb-8">
//           <StepIndicator step={1} current={step} />
//           <StepIndicator step={2} current={step} />
//           <StepIndicator step={3} current={step} />
//         </div>

//         {step === 1 && <ExamDetailsForm />}
//         {step === 2 && <ExamQuestionsForm />}
//         {step === 3 && <ExamReview />}

//         <div className="flex justify-between">
//           {step > 1 && (
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => setStep((currentStep) => currentStep - 1)}
//             >
//               Back
//             </Button>
//           )}
//           {step < 3 ? (
//             <Button type="button" onClick={handleNext}>
//               Next
//             </Button>
//           ) : (
//             <Button type="submit" loading={loading}>
//               Create Exam
//             </Button>
//           )}
//         </div>
//       </form>
//     </FormProvider>
//   );
// }

// function StepIndicator({ step, current }: { step: number; current: number }) {
//   return (
//     <div
//       className={cn(
//         "w-8 h-8 rounded-full flex items-center justify-center",
//         current >= step ? "bg-primary text-white" : "bg-muted"
//       )}
//     >
//       {step}
//     </div>
//   );
// }


//mock
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ExamDetailsForm } from "./ExamDetailsForm";
import { ExamQuestionsForm } from "./ExamQuestionsForm";
import { ExamReview } from "./ExamReview";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Extend your schema to include a boolean flag for mock exams.
const formSchema = z.object({
  title: z.string().min(3, "Exam title must be at least 3 characters"),
  subjectId: z.string().uuid("Please select a valid subject"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  scheduledAt: z.date(),
  instructions: z.string().optional(),
  shuffleOptions: z.boolean(),
  randomizeOrder: z.boolean(),
  passingScore: z.number().optional(),
  gradeLevel: z.string().min(1, "Grade level is required"),
  examCode: z.string().min(1, "Exam Code is required"),
  // New field for mock exam
  isMock: z.boolean().default(false),
  questions: z
    .array(
      z.object({
        content: z.object({ text: z.string().min(5, "Question text must be at least 5 characters") }),
        options: z.array(z.string().min(1, "Each option must be provided")).min(2, "At least 2 options are required"),
        correctAnswer: z.array(z.string()).min(1, "At least one correct answer is required"),
        points: z.number().min(1, "Points must be at least 1"),
      })
    )
    .min(1, "At least one question is required"),
});

export default function ExamCreationWizard({ onSuccess }: { onSuccess: (examId: string) => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subjectId: "",
      duration: 1,
      scheduledAt: new Date(),
      instructions: "",
      shuffleOptions: false,
      randomizeOrder: false,
      passingScore: 0,
      gradeLevel: "",
      examCode:"",
      isMock: false, // default not a mock exam
      questions: [],
    },
  });

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["title", "subjectId", "duration", "scheduledAt", "gradeLevel"]);
    } else if (step === 2) {
      isValid = await form.trigger("questions");
    } else {
      isValid = true;
    }
    if (isValid) {
      setStep((currentStep) => currentStep + 1);
    } else {
      toast.error("Please fill out all required fields before proceeding.");
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const examData = {
        ...values,
        scheduledAt: values.scheduledAt.toISOString(),
        // teacherId: "YOUR_TEACHER_ID_HERE", // Replace this with dynamic teacher ID from session
        maxScore: values.questions.reduce((sum, q) => sum + (q.points || 1), 0),
      };
      const res = await fetch(`/api/teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examData),
      });
      if (!res.ok) throw new Error("Failed to create exam");
      const data = await res.json();
      toast.success("Exam created successfully!");
      onSuccess(data.exam.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to create exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex gap-4 mb-8">
          <StepIndicator step={1} current={step} />
          <StepIndicator step={2} current={step} />
          <StepIndicator step={3} current={step} />
        </div>
        {step === 1 && <ExamDetailsForm />}
        {step === 2 && <ExamQuestionsForm />}
        {step === 3 && <ExamReview />}
        <div className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="secondary" onClick={() => setStep((currentStep) => currentStep - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" loading={loading}>
              Create Exam
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function StepIndicator({ step, current }: { step: number; current: number }) {
  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", current >= step ? "bg-primary text-white" : "bg-muted")}>
      {step}
    </div>
  );
}
