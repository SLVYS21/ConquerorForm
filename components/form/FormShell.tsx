"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Welcome } from "./Welcome";
import { Done } from "./Done";
import { InputRenderer, formatAnswerForDisplay } from "./InputRenderer";
import type { Question } from "@/config/form";
import { getOrCreateSessionId, collectContext, clearSessionId } from "@/lib/session";
import { trackSubmitApplication } from "@/lib/pixel";
import { celebrate } from "@/lib/confetti";
import type { Theme } from "@/data/theme.default";

type Props = { theme: Theme; questions: Question[] };

type Phase = "welcome" | "chat" | "done";

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isPhoneLike(v: string): boolean {
  return /\+?[\d\s().-]{6,}/.test(v);
}

function validate(q: Question, v: string): string | null {
  const trimmed = v?.trim() ?? "";
  if (!trimmed) return q.required ? "Ce champ est requis." : null;
  if (q.type === "email" && !isEmail(trimmed)) return "Email invalide.";
  if ((q.type === "phone" || q.type === "country_phone") && !isPhoneLike(trimmed)) {
    return "Numéro invalide.";
  }
  return null;
}

function hapticTick() {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(8);
    } catch {
      /* noop */
    }
  }
}

export function FormShell({ theme, questions }: Props) {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [typingPhase, setTypingPhase] = useState<null | "start" | "advance">(null);
  const isTyping = typingPhase !== null;
  const sessionIdRef = useRef<string>("");
  const metaSentRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  const total = questions.length;
  const currentQ = questions[stepIndex];
  const currentValue = answers[currentQ?.id ?? ""] ?? "";

  const answeredHistory = useMemo(() => {
    return questions.slice(0, stepIndex).map((q) => ({
      question: q,
      answer: answers[q.id] ?? "",
    }));
  }, [questions, stepIndex, answers]);

  useEffect(() => {
    if (phase !== "chat") return;
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [phase, stepIndex, isTyping]);

  const save = useCallback(
    async (allAnswers: Record<string, string>, currentStepIndex: number, completed = false) => {
      const filledCount = Object.values(allAnswers).filter((v) => v && v.trim()).length;
      if (!completed && total >= 2 && filledCount < 2) return;

      const body: Record<string, unknown> = {
        session_id: sessionIdRef.current,
        current_step: currentStepIndex,
        patch: allAnswers,
        completed,
      };
      if (!metaSentRef.current) {
        body.meta = collectContext();
        metaSentRef.current = true;
      }
      try {
        await fetch("/api/responses", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          keepalive: true,
        });
      } catch {
        /* silent */
      }
    },
    [total]
  );

  useEffect(() => {
    function beforeUnload() {
      if (phase === "done") return;
      const filledCount = Object.values(answers).filter((v) => v && v.trim()).length;
      if (total >= 2 && filledCount < 2) return;
      if (filledCount === 0) return;
      const payload = JSON.stringify({
        session_id: sessionIdRef.current,
        current_step: stepIndex,
        patch: answers,
        completed: false,
        meta: metaSentRef.current ? undefined : collectContext(),
      });
      try {
        navigator.sendBeacon(
          "/api/responses",
          new Blob([payload], { type: "application/json" })
        );
      } catch {
        /* noop */
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [answers, stepIndex, phase, total]);

  const startForm = useCallback(() => {
    setPhase("chat");
    setTypingPhase("start");
    window.setTimeout(() => setTypingPhase(null), 700);
  }, []);

  const setValue = useCallback(
    (v: string) => {
      setError(null);
      setAnswers((a) => ({ ...a, [currentQ.id]: v }));
    },
    [currentQ]
  );

  const advance = useCallback(() => {
    const q = currentQ;
    const v = (answers[q.id] ?? "").trim();
    const err = validate(q, v);
    if (err) {
      setError(err);
      return;
    }
    const nextAnswers = { ...answers, [q.id]: v };
    const isLast = stepIndex === total - 1;
    hapticTick();

    if (isLast) {
      trackSubmitApplication();
      celebrate(theme.accent);
      save(nextAnswers, stepIndex, true).finally(() => clearSessionId());

      if (theme.redirectUrl) {
        setTimeout(() => {
          window.location.href = theme.redirectUrl;
        }, 900);
      }
      setPhase("done");
      return;
    }

    save(nextAnswers, stepIndex, false);
    setTypingPhase("advance");
    window.setTimeout(() => {
      setStepIndex((i) => i + 1);
      setTypingPhase(null);
    }, 650);
  }, [answers, currentQ, save, stepIndex, total, theme.accent, theme.redirectUrl]);

  const back = useCallback(() => {
    setError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  return (
    <>
      {theme.progressBar && phase === "chat" ? (
        <ProgressBar currentStep={stepIndex} totalSteps={total} />
      ) : null}
      <main
        className="min-h-dvh flex flex-col items-center px-4 py-16 md:py-20"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <AnimatePresence mode="wait">
          {phase === "welcome" ? (
            <Welcome
              key="welcome"
              title={theme.welcomeTitle}
              description={theme.welcomeDescription}
              ctaLabel={theme.welcomeCta}
              onStart={startForm}
              avatarSrc={theme.avatarUrl}
              avatarName={theme.avatarName}
            />
          ) : phase === "done" ? (
            <Done key="done" title={theme.doneTitle} description={theme.doneDescription} />
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-2xl flex flex-col"
            >
              <div ref={scrollRef} className="flex flex-col gap-3 mb-6">
                {answeredHistory.map(({ question, answer }) => (
                  <div key={question.id} className="flex flex-col gap-3">
                    <ChatBubble
                      kind="question"
                      avatarSrc={theme.avatarUrl}
                      avatarName={theme.avatarName}
                    >
                      <div className="whitespace-pre-line">{question.label}</div>
                    </ChatBubble>
                    {answer ? (
                      <ChatBubble kind="answer">
                        {formatAnswerForDisplay(question, answer)}
                      </ChatBubble>
                    ) : null}
                  </div>
                ))}

                <AnimatePresence mode="wait" initial={false}>
                  {typingPhase === "advance" ? (
                    <motion.div
                      key={`typing-advance-${stepIndex}`}
                      className="flex flex-col gap-3"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <ChatBubble
                        kind="question"
                        avatarSrc={theme.avatarUrl}
                        avatarName={theme.avatarName}
                      >
                        <div className="whitespace-pre-line">{currentQ.label}</div>
                      </ChatBubble>
                      {currentValue ? (
                        <ChatBubble kind="answer" animateIn>
                          {formatAnswerForDisplay(currentQ, currentValue)}
                        </ChatBubble>
                      ) : null}
                      <TypingIndicator
                        avatarSrc={theme.avatarUrl}
                        avatarName={theme.avatarName}
                      />
                    </motion.div>
                  ) : typingPhase === "start" ? (
                    <TypingIndicator
                      key="typing-start"
                      avatarSrc={theme.avatarUrl}
                      avatarName={theme.avatarName}
                    />
                  ) : (
                    <ChatBubble
                      key={`q-${currentQ.id}`}
                      kind="question"
                      avatarSrc={theme.avatarUrl}
                      avatarName={theme.avatarName}
                      animateIn
                    >
                      <div>
                        <div className="text-[15px] md:text-[16px] font-medium whitespace-pre-line">{currentQ.label}</div>
                        {currentQ.hint ? (
                          <div
                            className="mt-1 text-[13px] leading-relaxed whitespace-pre-line"
                            style={{ color: "color-mix(in oklab, var(--bubble-text) 55%, transparent)" }}
                          >
                            {currentQ.hint}
                          </div>
                        ) : null}
                      </div>
                    </ChatBubble>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                key={`input-${currentQ.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isTyping ? 0 : 1, y: isTyping ? 8 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: isTyping ? 0 : 0.2 }}
                className="pl-[40px]"
                style={{ pointerEvents: isTyping ? "none" : "auto" }}
                aria-hidden={isTyping}
              >
                <InputRenderer
                  question={currentQ}
                  value={currentValue}
                  onChange={setValue}
                  onSubmit={advance}
                />

                {error ? (
                  <div className="mt-3 text-[13px] font-medium" style={{ color: "#DC2626" }}>
                    {error}
                  </div>
                ) : null}

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={advance}
                    disabled={isTyping}
                    className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-[14px] transition-all hover:brightness-95 active:brightness-90 disabled:opacity-60"
                    style={{
                      background: "var(--accent)",
                      color: "var(--accent-text)",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 10px 30px -12px var(--accent)",
                    }}
                  >
                    {stepIndex === total - 1 ? "Envoyer" : "OK"}
                    <span aria-hidden>→</span>
                  </button>
                  <span
                    className="text-[12px] hidden md:inline"
                    style={{ color: "var(--muted)" }}
                  >
                    Ou appuie sur{" "}
                    <kbd
                      className="px-1.5 py-0.5 border text-[11px]"
                      style={{ borderColor: "var(--border)", borderRadius: `calc(var(--radius) * 0.4)` }}
                    >
                      Entrée
                    </kbd>
                  </span>
                  {stepIndex > 0 ? (
                    <button
                      type="button"
                      onClick={back}
                      className="ml-auto text-[12px] px-2 py-1 transition-colors hover:opacity-70"
                      style={{ color: "var(--muted)" }}
                    >
                      ← Retour
                    </button>
                  ) : null}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
