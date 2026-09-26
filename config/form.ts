export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "country_phone"
  | "choice"
  | "number"
  | "textarea";

export type Choice = { value: string; label: string };

export type Question = {
  id: string;
  type: FieldType;
  label: string;
  hint?: string;
  placeholder?: string;
  required: boolean;
  choices?: Choice[];
};

export const QUESTIONS: Question[] = [
  {
    id: "first_name",
    type: "text",
    label: "Quel est ton prénom ?",
    placeholder: "Ex. Sylvanus",
    required: true,
  },
  {
    id: "email",
    type: "email",
    label: "Ton meilleur email ?",
    hint: "On t'y envoie la confirmation.",
    placeholder: "toi@exemple.com",
    required: true,
  },
  {
    id: "whatsapp",
    type: "country_phone",
    label: "Ton numéro WhatsApp ?",
    hint: "Choisis ton pays puis saisis le numéro.",
    placeholder: "00 00 00 00 00",
    required: true,
  },
  {
    id: "situation",
    type: "choice",
    label: "Où en es-tu aujourd'hui ?",
    required: true,
    choices: [
      { value: "beginner", label: "Je démarre à zéro" },
      { value: "tested_no_result", label: "J'ai déjà testé sans résultat" },
      { value: "scaling", label: "Je fais déjà du CA, je veux scaler" },
    ],
  },
  {
    id: "goal_revenue",
    type: "choice",
    label: "Ton objectif de revenu mensuel à 6 mois ?",
    required: true,
    choices: [
      { value: "under_1k", label: "Moins de 1 000 €" },
      { value: "1k_5k", label: "1 000 à 5 000 €" },
      { value: "5k_15k", label: "5 000 à 15 000 €" },
      { value: "15k_plus", label: "Plus de 15 000 €" },
    ],
  },
  {
    id: "notes",
    type: "textarea",
    label: "Une chose à savoir sur toi avant qu'on se parle ?",
    hint: "Optionnel, un contexte, un blocage, une ambition.",
    placeholder: "Écris librement…",
    required: false,
  },
];
