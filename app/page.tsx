import { FormShell } from "@/components/form/FormShell";
import { getTheme } from "@/lib/theme";
import { getQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [theme, questions] = await Promise.all([getTheme(), getQuestions()]);
  return <FormShell theme={theme} questions={questions} />;
}
