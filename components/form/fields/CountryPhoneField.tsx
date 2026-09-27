"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { orderedCountries, flagEmoji, getCountry, DEFAULT_COUNTRY_ISO, AFRICAN_ISO } from "@/data/countries";

type Props = {
  value: string; // stored as "+229 12 34 56 78"
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

function parseValue(v: string, fallbackIso: string): { iso: string; number: string } {
  const match = v.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) {
    const dial = match[1];
    const country = orderedCountries().find((c) => c.dial === dial);
    if (country) return { iso: country.iso2, number: match[2] };
  }
  return { iso: fallbackIso, number: v };
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export function CountryPhoneField({ value, onChange, onSubmit, placeholder }: Props) {
  const initial = useMemo(() => parseValue(value, DEFAULT_COUNTRY_ISO), [value]);
  const [iso, setIso] = useState(initial.iso);
  const [number, setNumber] = useState(initial.number);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const country = getCountry(iso);
  const list = useMemo(() => {
    const all = orderedCountries();
    if (!q.trim()) return all;
    const needle = q.trim().toLowerCase();
    return all.filter(
      (c) =>
        c.nameFr.toLowerCase().includes(needle) ||
        c.dial.includes(needle) ||
        c.iso2.toLowerCase().includes(needle)
    );
  }, [q]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open || isMobile) return;
    function onDoc(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  useEffect(() => {
    const dial = country?.dial ?? "";
    const combined = number ? `${dial} ${number.trim()}` : "";
    onChange(combined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso, number]);

  const africanSet = new Set(AFRICAN_ISO);

  const listContent = (
    <>
      {list.length === 0 ? (
        <div className="px-3 py-6 text-[14px] text-center" style={{ color: "var(--muted)" }}>
          Aucun résultat
        </div>
      ) : (
        list.map((c, idx) => {
          const isAfrican = africanSet.has(c.iso2);
          const isLastAfrican =
            !q && isAfrican && idx === list.length - 1
              ? false
              : !q && isAfrican && !africanSet.has(list[idx + 1]?.iso2 ?? "");
          return (
            <div key={c.iso2}>
              <button
                type="button"
                onClick={() => {
                  setIso(c.iso2);
                  setOpen(false);
                  setQ("");
                  setTimeout(() => inputRef.current?.focus(), 20);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] transition-colors active:opacity-70 sm:hover:opacity-80 sm:py-2"
                style={{
                  background:
                    iso === c.iso2
                      ? "color-mix(in oklab, var(--accent) 10%, transparent)"
                      : "transparent",
                  color: "var(--text)",
                }}
              >
                <span className="text-[22px] leading-none">{flagEmoji(c.iso2)}</span>
                <span className="flex-1 truncate">{c.nameFr}</span>
                <span className="tabular-nums text-[14px]" style={{ color: "var(--muted)" }}>
                  {c.dial}
                </span>
              </button>
              {isLastAfrican ? (
                <div
                  className="mx-4 my-1 h-px"
                  style={{ background: "var(--border)" }}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })
      )}
    </>
  );

  return (
    <div className="flex gap-2 w-full items-stretch">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-full px-3 py-3 flex items-center gap-2 border-2 text-[15px] font-medium transition-colors"
          style={{
            borderColor: open ? "var(--accent)" : "var(--border)",
            borderRadius: "var(--radius)",
            background: "transparent",
            color: "var(--text)",
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-[20px] leading-none">{flagEmoji(iso)}</span>
          <span className="tabular-nums" style={{ color: "var(--muted)" }}>
            {country?.dial ?? ""}
          </span>
          <span className="ml-1 text-[10px] opacity-60">▾</span>
        </button>

        {/* Desktop popover */}
        {open && !isMobile ? (
          <div
            className="absolute left-0 top-[calc(100%+6px)] z-50 w-[340px] max-h-[380px] overflow-hidden flex flex-col shadow-2xl"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          >
            <div className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un pays…"
                className="w-full px-3 py-2 text-[14px]"
                style={{
                  background: "var(--bubble-bg)",
                  color: "var(--text)",
                  borderRadius: `calc(var(--radius) * 0.6)`,
                  border: "none",
                  outline: "none",
                }}
              />
            </div>
            <div className="overflow-y-auto no-scrollbar">{listContent}</div>
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="tel"
        inputMode="tel"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-4 py-3 text-[16px] md:text-[15px] font-medium border-2 transition-colors placeholder:opacity-40"
        style={{
          borderColor: number ? "var(--border-focus)" : "var(--border)",
          borderRadius: "var(--radius)",
          background: "transparent",
          color: "var(--text)",
          caretColor: "var(--accent)",
        }}
      />

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {open && isMobile ? (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.45)" }}
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 500) setOpen(false);
              }}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[85dvh]"
              style={{
                background: "var(--bg)",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                boxShadow: "0 -20px 60px -12px rgba(0,0,0,0.35)",
                paddingBottom: "env(safe-area-inset-bottom, 12px)",
              }}
            >
              <div className="flex justify-center pt-2 pb-1">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: "var(--border)" }}
                  aria-hidden
                />
              </div>
              <div
                className="flex items-center justify-between px-4 pt-2 pb-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                  Choisis ton pays
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[13px] px-2 py-1"
                  style={{ color: "var(--muted)" }}
                >
                  Fermer
                </button>
              </div>
              <div className="p-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher un pays…"
                  className="w-full px-4 py-3 text-[16px]"
                  style={{
                    background: "var(--bubble-bg)",
                    color: "var(--text)",
                    borderRadius: `calc(var(--radius) * 0.6)`,
                    border: "none",
                    outline: "none",
                  }}
                />
              </div>
              <div className="overflow-y-auto flex-1 pb-2">{listContent}</div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
