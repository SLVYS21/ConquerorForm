import { FormShell } from "@/components/form/FormShell";
import { getTheme } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function Page() {
  const theme = await getTheme();
  return <FormShell theme={theme} />;
}
