"use client";

import { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import type { Theme, FontKey, ButtonStyle } from "@/data/theme.default";
import { PRESETS } from "@/config/presets";
import { FONT_LABEL_BY_KEY } from "@/lib/theme-css";
import { ThemePreview } from "./ThemePreview";

const COLOR_FIELDS: { key: keyof Theme; label: string; hint?: string }[] = [
  { key: "accent", label: "Accent", hint: "Boutons, focus, progression, réponse utilisateur." },
  { key: "accentText", label: "Texte sur accent" },
  { key: "bg", label: "Fond" },
  { key: "text", label: "Texte principal" },
  { key: "muted", label: "Texte secondaire" },
  { key: "border", label: "Contours" },
  { key: "borderFocus", label: "Contour au focus" },
  { key: "bubbleBg", label: "Bulle question (fond)" },
  { key: "bubbleText", label: "Bulle question (texte)" },
];

const FONTS: FontKey[] = ["inter", "space", "dm", "instrument", "fraunces"];
const BUTTON_STYLES: ButtonStyle[] = ["filled", "outline", "soft"];

export function ThemeEditor({ initial }: { initial: Theme }) {
  const [theme, setTheme] = useState<Theme>(initial);
  const [openColor, setOpenColor] = useState<keyof Theme | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const patch = useCallback((p: Partial<Theme>) => {
    setTheme((t) => ({ ...t, ...p }));
    setStatus("idle");
  }, []);

  const applyPreset = useCallback(
    (id: string) => {
      const preset = PRESETS.find((p) => p.id === id);
      if (!preset) return;
      patch(preset.patch);
    },
    [patch]
  );

  async function save() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(theme),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      <div>
        <Section title="Presets" hint="Application 1-clic.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="p-3 border-2 text-left transition-all hover:translate-y-[-1px]"
                style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
              >
                <div className="flex gap-1 mb-2">
                  <div className="w-4 h-4 rounded-full border" style={{ background: p.patch.bg, borderColor: "var(--border)" }} />
                  <div className="w-4 h-4 rounded-full" style={{ background: p.patch.accent }} />
                  <div className="w-4 h-4 rounded-full border" style={{ background: p.patch.text, borderColor: "var(--border)" }} />
                </div>
                <div className="text-[13px] font-medium">{p.name}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Page d'accueil" hint="Ce que le visiteur voit avant de commencer.">
          <TextInput
            label="Titre"
            value={theme.welcomeTitle}
            onChange={(v) => patch({ welcomeTitle: v })}
          />
          <TextInput
            label="Description"
            multiline
            value={theme.welcomeDescription}
            onChange={(v) => patch({ welcomeDescription: v })}
          />
          <TextInput
            label="Bouton"
            value={theme.welcomeCta}
            onChange={(v) => patch({ welcomeCta: v })}
          />
        </Section>

        <Section title="Avatar et nom" hint="Photo circulaire à côté des questions.">
          <TextInput
            label="URL de l'image"
            value={theme.avatarUrl}
            onChange={(v) => patch({ avatarUrl: v })}
            placeholder="/avatar.jpg ou https://..."
            hint="Chemin local (dépose l'image dans /public) ou URL externe. Vide = initiale sur fond accent."
          />
          <TextInput
            label="Nom affiché"
            value={theme.avatarName}
            onChange={(v) => patch({ avatarName: v })}
            placeholder="EcomConqueror"
          />
        </Section>

        <Section title="Après le submit" hint="Message final et redirection éventuelle.">
          <TextInput
            label="Titre de fin"
            value={theme.doneTitle}
            onChange={(v) => patch({ doneTitle: v })}
          />
          <TextInput
            label="Description de fin"
            multiline
            value={theme.doneDescription}
            onChange={(v) => patch({ doneDescription: v })}
          />
          <TextInput
            label="URL de redirection après submit"
            value={theme.redirectUrl}
            onChange={(v) => patch({ redirectUrl: v })}
            placeholder="https://calendly.com/..."
            hint="Optionnel. Si renseigné, le visiteur est redirigé après une brève animation de confettis."
          />
        </Section>

        <Section title="Couleurs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COLOR_FIELDS.map((f) => (
              <ColorRow
                key={f.key}
                label={f.label}
                hint={f.hint}
                value={theme[f.key] as string}
                onChange={(v) => patch({ [f.key]: v } as Partial<Theme>)}
                open={openColor === f.key}
                onToggle={() => setOpenColor(openColor === f.key ? null : f.key)}
              />
            ))}
          </div>
        </Section>

        <Section title="Forme">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-medium mb-2">Border-radius : {theme.radius}px</label>
              <input
                type="range"
                min={0}
                max={32}
                value={theme.radius}
                onChange={(e) => patch({ radius: Number(e.target.value) })}
                className="w-full"
                style={{ accentColor: theme.accent }}
              />
              <div className="flex justify-between text-[11px] mt-1" style={{ color: "var(--muted)" }}>
                <span>Carré</span>
                <span>Doux</span>
                <span>Rond</span>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-2">Style des boutons</label>
              <div className="flex gap-2">
                {BUTTON_STYLES.map((b) => (
                  <button
                    key={b}
                    onClick={() => patch({ buttonStyle: b })}
                    className="flex-1 px-3 py-2 text-[13px] border-2 font-medium capitalize"
                    style={{
                      borderColor: theme.buttonStyle === b ? theme.accent : "var(--border)",
                      background: theme.buttonStyle === b ? "color-mix(in oklab, var(--accent) 8%, transparent)" : "transparent",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Typographie">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FONTS.map((f) => (
              <button
                key={f}
                onClick={() => patch({ font: f })}
                className="p-3 border-2 text-left"
                style={{
                  borderColor: theme.font === f ? theme.accent : "var(--border)",
                  background: theme.font === f ? "color-mix(in oklab, var(--accent) 8%, transparent)" : "transparent",
                  borderRadius: "var(--radius)",
                }}
              >
                <div className="text-[16px] font-semibold" style={{ fontFamily: `"${FONT_LABEL_BY_KEY[f]}"` }}>Aa</div>
                <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
                  {FONT_LABEL_BY_KEY[f]}
                </div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Divers">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={theme.progressBar}
              onChange={(e) => patch({ progressBar: e.target.checked })}
              className="w-4 h-4"
              style={{ accentColor: theme.accent }}
            />
            <span className="text-[14px] font-medium">Afficher la barre de progression</span>
          </label>
        </Section>

        <div className="flex items-center gap-4 pt-6 border-t sticky bottom-4 py-4 -mb-4" style={{
          borderColor: "var(--border)",
          background: "color-mix(in oklab, var(--bg) 85%, transparent)",
          backdropFilter: "blur(8px)",
        }}>
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-3 font-semibold text-[15px] transition-all disabled:opacity-40"
            style={{
              background: "var(--accent)",
              color: "var(--accent-text)",
              borderRadius: "var(--radius)",
            }}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          {status === "saved" ? (
            <span className="text-[13px] font-medium" style={{ color: "var(--accent)" }}>
              ✓ Enregistré, appliqué au formulaire public.
            </span>
          ) : null}
          {status === "error" ? (
            <span className="text-[13px] font-medium" style={{ color: "#DC2626" }}>
              Erreur. Vérifie que la Sheet est bien configurée.
            </span>
          ) : null}
        </div>
      </div>

      <ThemePreview theme={theme} />
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {hint ? <p className="text-[13px] mt-0.5" style={{ color: "var(--muted)" }}>{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  multiline,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-[13px] font-medium mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 text-[14px] border-2 transition-colors resize-none placeholder:opacity-40"
          style={{
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            background: "transparent",
            color: "var(--text)",
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-[14px] border-2 transition-colors placeholder:opacity-40"
          style={{
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            background: "transparent",
            color: "var(--text)",
          }}
        />
      )}
      {hint ? <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>{hint}</p> : null}
    </div>
  );
}

function ColorRow({
  label,
  hint,
  value,
  onChange,
  open,
  onToggle,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 border transition-colors"
        style={{ borderColor: open ? "var(--accent)" : "var(--border)", borderRadius: "var(--radius)" }}
      >
        <div
          className="w-8 h-8 shrink-0 border"
          style={{ background: value, borderColor: "var(--border)", borderRadius: `calc(var(--radius) * 0.6)` }}
        />
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[13px] font-medium truncate">{label}</div>
          <div className="text-[11px] font-mono" style={{ color: "var(--muted)" }}>{value.toUpperCase()}</div>
        </div>
      </button>
      {open ? (
        <div
          className="absolute z-30 mt-2 p-3 shadow-xl"
          style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
        >
          <HexColorPicker color={value} onChange={onChange} />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-3 w-full px-2 py-1.5 text-[12px] font-mono border"
            style={{ borderColor: "var(--border)", borderRadius: `calc(var(--radius) * 0.6)`, color: "var(--text)" }}
          />
          {hint ? <p className="mt-2 text-[11px] max-w-[220px]" style={{ color: "var(--muted)" }}>{hint}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
