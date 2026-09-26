import { getTheme } from "@/lib/theme";
import { DEFAULT_THEME } from "@/data/theme.default";
import { ThemeEditor } from "@/components/admin/ThemeEditor";

export const dynamic = "force-dynamic";

export default async function ThemePage() {
  let theme = DEFAULT_THEME;
  try {
    theme = await getTheme();
  } catch {
    /* fallback */
  }
  return (
    <div>
      <div className="mb-8">
        <div className="text-[13px] uppercase tracking-wide mb-2" style={{ color: "var(--muted)" }}>
          Personnalisation
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Paramètres du formulaire</h1>
        <p className="mt-2 text-[15px]" style={{ color: "var(--muted)" }}>
          Contenus, avatar, redirection, thème visuel. L'aperçu à droite reflète tes changements en direct.
        </p>
      </div>
      <ThemeEditor initial={theme} />
    </div>
  );
}
