import { ExamForm } from '@/components/teacher/exam-form';
import { notFound } from 'next/navigation';

export default function EditExamPage({ params }: { params: { id: string } }) {
  const exam = await getExamById(params.id); // Fetch exam data
  if (!exam) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Exam: {exam.title}</h1>
      <ExamForm defaultValues={exam} />
    </div>
  );
}