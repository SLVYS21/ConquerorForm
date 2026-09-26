"use client";

import type { Question } from "@/config/form";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { ChoiceField } from "./fields/ChoiceField";
import { CountryPhoneField } from "./fields/CountryPhoneField";

type Props = {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export function InputRenderer({ question, value, onChange, onSubmit }: Props) {
  switch (question.type) {
    case "choice":
      return (
        <ChoiceField
          choices={question.choices ?? []}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      );
    case "textarea":
      return (
        <TextareaField
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={question.placeholder}
        />
      );
    case "country_phone":
      return (
        <CountryPhoneField
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={question.placeholder}
        />
      );
    case "email":
      return (
        <TextField
          type="email"
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={question.placeholder}
          autoComplete="email"
        />
      );
    case "phone":
      return (
        <TextField
          type="tel"
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={question.placeholder}
          autoComplete="tel"
        />
      );
    case "number":
      return (
        <TextField
          type="number"
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={question.placeholder}
        />
      );
    default:
      return (
        <TextField
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={question.placeholder}
        />
      );
  }
}

export function formatAnswerForDisplay(question: Question, value: string): string {
  if (!value) return "";
  if (question.type === "choice") {
    const c = question.choices?.find((c) => c.value === value);
    return c?.label ?? value;
  }
  return value;
}
