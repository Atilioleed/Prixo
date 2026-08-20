import type { AgeRange, SexOption, LevelKey } from "@/lib/tutorProfile";
import {
  IconOpenBook,
  IconMessageDots,
  IconCompass,
  IconHeart,
  IconBriefcase,
  IconCap,
  IconTarget,
  IconMedal,
  IconBuilding,
  IconChild,
  IconTeen,
  IconUser,
  IconElder,
  IconGenderFemale,
  IconGenderMale,
  IconGenderNeutral,
} from "@/components/icons/Icon";

export interface IconOption<T extends string> {
  value: T;
  label: string;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

export const AGE_RANGES: IconOption<AgeRange>[] = [
  { value: "nino", label: "Niño", sub: "6–12 años", icon: IconChild },
  { value: "adolescente", label: "Adolescente", sub: "13–17 años", icon: IconTeen },
  { value: "adulto", label: "Adulto", sub: "18–59 años", icon: IconUser },
  { value: "adulto_mayor", label: "Adulto mayor", sub: "60+ años", icon: IconElder },
];

export const SEX_OPTIONS: IconOption<SexOption>[] = [
  { value: "femenino", label: "Femenino", icon: IconGenderFemale },
  { value: "masculino", label: "Masculino", icon: IconGenderMale },
  { value: "prefiero_no_decir", label: "Prefiero no decirlo", icon: IconGenderNeutral },
];

export const LEVELS: IconOption<LevelKey>[] = [
  { value: "principiante", label: "Principiante total", sub: "Casi no conozco palabras", icon: IconOpenBook },
  { value: "basico", label: "Básico", sub: "Frases muy simples", icon: IconOpenBook },
  { value: "intermedio", label: "Intermedio", sub: "Converso con esfuerzo", icon: IconOpenBook },
  { value: "avanzado", label: "Avanzado", sub: "Fluidez con errores", icon: IconOpenBook },
  { value: "fluido", label: "Casi nativo", sub: "Domino el idioma", icon: IconOpenBook },
];

export const GOALS: IconOption<string>[] = [
  { value: "general", label: "Aprender de forma general", sub: "Todavía no tengo un objetivo puntual", icon: IconOpenBook },
  { value: "hablar", label: "Hablar con fluidez", sub: "Conversación del día a día", icon: IconMessageDots },
  { value: "viajar", label: "Viajar", sub: "Aeropuertos, hoteles, turismo", icon: IconCompass },
  { value: "citas", label: "Citas", sub: "Conocer gente, socializar", icon: IconHeart },
  { value: "reuniones", label: "Reuniones y negocios", sub: "Trabajo, negociaciones", icon: IconBriefcase },
  { value: "colegio", label: "Clases del colegio o universidad", sub: "Reforzar lo que ya estudio", icon: IconCap },
  { value: "entrevista", label: "Entrevista de trabajo", sub: "Una entrevista puntual", icon: IconTarget },
  { value: "examen", label: "Examen o certificación", sub: "TOEFL, IELTS, DELE, etc.", icon: IconMedal },
  { value: "mudanza", label: "Vivir en el extranjero", sub: "Mudarme o estudiar afuera", icon: IconBuilding },
];

export const LEVEL_LABEL: Record<LevelKey, string> = Object.fromEntries(
  LEVELS.map((l) => [l.value, l.label])
) as Record<LevelKey, string>;

export const AGE_LABEL: Record<AgeRange, string> = Object.fromEntries(
  AGE_RANGES.map((a) => [a.value, a.label])
) as Record<AgeRange, string>;

// Maps the learner's self-reported level to a starting point in the curriculum (STAGES, A1-C1).
export const LEVEL_TO_STAGE: Record<LevelKey, number> = {
  principiante: 0,
  basico: 1,
  intermedio: 2,
  avanzado: 3,
  fluido: 4,
};

export interface TutorOption {
  name: string;
  accent: string;
  blurb: string;
}

export const TUTORS: TutorOption[] = [
  { name: "Max", accent: "Americano", blurb: "Cercano y motivador" },
  { name: "Sofía", accent: "Neutro", blurb: "Paciente y clara" },
  { name: "Leo", accent: "Británico", blurb: "Directo y exigente" },
  { name: "Nina", accent: "Neutro", blurb: "Cálida y divertida" },
];
