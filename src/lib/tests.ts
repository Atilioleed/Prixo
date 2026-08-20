// Shared types for the real multiple-choice exam system that gates
// advancing a Temario stage — used by admin CRUD, the public/student
// routes, and the student-facing exam UI. Deliberately plain (no "use
// client"), same reasoning as src/lib/tutorProfile.ts.

export interface TestQuestion {
  id: string;
  prompt: string;
  options: string[]; // always exactly 4
  correctIndex: number; // 0-3
}

export interface TestFields {
  title: string;
  language: string;
  ageRange: string;
  level: string;
  kind: "checkpoint" | "final";
  passingScore: number;
  questions: TestQuestion[];
}

/** What a student sees before submitting — never includes correctIndex, so answers can't be read from the network tab. */
export interface PublicQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export function toPublicQuestions(questions: TestQuestion[]): PublicQuestion[] {
  return questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options }));
}

export function scoreAnswers(
  questions: TestQuestion[],
  answers: Record<string, number>
): { correctCount: number; total: number; score: number } {
  const total = questions.length;
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  return { correctCount, total, score };
}
