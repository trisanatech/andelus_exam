'use client'

import ExamCreationWizard from "@/components/teacher/exam-creation-wizard";
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CreateExamPage() {
  const router = useRouter()

  const handleSuccess = (examId: string) => {
    toast.success('Exam created successfully!')
    router.push(`/teacher/exams/${examId}/edit`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Exam</h1>
      <ExamCreationWizard onSuccess={handleSuccess} />
    </div>
  )
}