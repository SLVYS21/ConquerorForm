import { getQuestions } from "@/lib/questions";
import { DEFAULT_QUESTIONS } from "@/data/questions.default";
import { QuestionsEditor } from "@/components/admin/QuestionsEditor";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  let questions = DEFAULT_QUESTIONS;
  try {
    questions = await getQuestions();
  } catch {
    /* fallback */
  }
  return (
    <div>
      <div className="mb-6 md:mb-8">
        <div className="text-[12px] md:text-[13px] uppercase tracking-wide mb-1.5 md:mb-2" style={{ color: "var(--muted)" }}>
          Form builder
        </div>
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">Questions du formulaire</h1>
        <p className="mt-2 text-[14px] md:text-[15px]" style={{ color: "var(--muted)" }}>
          Réorganise, modifie, ajoute des questions. Publie pour appliquer au formulaire public.
        </p>
      </div>
      <QuestionsEditor initial={questions} />
    </div>
  );
}
