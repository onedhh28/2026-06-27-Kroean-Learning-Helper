import type { Grammar, QuizQuestion, Vocabulary } from "./types";

const defaultDistractors = ["은/는", "이/가", "을/를", "에", "에서", "와/과", "도", "하고", "로/으로", "에게/한테"];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function inSelectedChapter(itemChapters: string[], selected: string[]) {
  return selected.length === 0 || selected.includes("全部") || itemChapters.some((chapter) => selected.includes(chapter));
}

export function normalizeAnswer(value: string) {
  return value.trim();
}

export function isStringCorrect(userAnswer: string, correctAnswer: string) {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

export function updateFamiliarity(current: { quiz_count: number; correct_streak: number }, isCorrect: boolean) {
  const quiz_count = current.quiz_count + 1;
  const correct_streak = isCorrect ? current.correct_streak + 1 : 0;
  return {
    quiz_count,
    correct_streak,
    familiarity: quiz_count >= 3 && correct_streak >= 3 ? "yes" : "no"
  };
}

export function buildQuiz(vocabulary: Vocabulary[], grammar: Grammar[], selectedChapters: string[]): QuizQuestion[] {
  const vocabPool = shuffle(vocabulary.filter((item) => inSelectedChapter(item.chapters, selectedChapters)));
  const zhToKo = vocabPool.slice(0, 14).map<QuizQuestion>((item) => ({
    id: `vocab-zh-ko-${item.id}`,
    itemType: "vocabulary",
    itemId: item.id,
    questionType: "vocab_zh_to_ko",
    prompt: item.meaning,
    answer: item.korean
  }));
  const koToZh = vocabPool.slice(14, 20).map<QuizQuestion>((item) => ({
    id: `vocab-ko-zh-${item.id}`,
    itemType: "vocabulary",
    itemId: item.id,
    questionType: "vocab_ko_to_zh",
    prompt: item.korean,
    answer: item.meaning
  }));

  const grammarPool = shuffle(grammar.filter((item) => inSelectedChapter(item.chapters, selectedChapters)));
  const cloze = grammarPool
    .filter((item) => item.cloze_question && item.cloze_answer)
    .slice(0, 10)
    .map<QuizQuestion>((item) => ({
      id: `grammar-cloze-${item.id}`,
      itemType: "grammar",
      itemId: item.id,
      questionType: "grammar_cloze",
      prompt: item.cloze_question!,
      answer: item.cloze_answer!
    }));

  const clozeAnswers = grammarPool.map((item) => item.cloze_answer).filter(Boolean) as string[];
  const choices = grammarPool
    .filter((item) => item.cloze_question && item.cloze_answer)
    .slice(10, 16)
    .map<QuizQuestion>((item) => {
      const distractors = shuffle([...clozeAnswers.filter((answer) => answer !== item.cloze_answer), ...defaultDistractors]).slice(0, 3);
      return {
        id: `grammar-choice-${item.id}`,
        itemType: "grammar",
        itemId: item.id,
        questionType: "grammar_choice",
        prompt: item.cloze_question!,
        answer: item.cloze_answer!,
        options: shuffle([item.cloze_answer!, ...distractors])
      };
    });

  const translations = grammarPool
    .filter((item) => item.translation_question && item.translation_reference_answer)
    .slice(16, 20)
    .map<QuizQuestion>((item) => ({
      id: `grammar-translation-${item.id}`,
      itemType: "grammar",
      itemId: item.id,
      questionType: "grammar_translation",
      prompt: item.translation_question!,
      answer: item.translation_reference_answer!,
      selfGrade: true
    }));

  return [...zhToKo, ...koToZh, ...cloze, ...choices, ...translations];
}
