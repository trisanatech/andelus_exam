import { QuestionManager } from '@/components/teacher/question-manager';

export default function ManageQuestionsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Questions</h1>
      <QuestionManager examId={params.id} />
    </div>
  );
}