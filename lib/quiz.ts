import type { Grammar, QuizQuestion, Vocabulary } from "./types";

const defaultDistractors = ["은/는", "이/가", "을/를", "에", "에서", "와/과", "도", "하고", "로/으로", "에게/한테"];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function inSelectedChapter(itemChapters: string[], selected: string[]) {
  return selected.length === 0 || selected.includes("全部") || itemChapters.some((chapter) => selected.includes(chapter));
}

export function normalizeAnswer(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/[，,。．.、；;：:！？!?'"“”‘’`~（）()［\][\]{}<>《》〈〉]/g, "")
    .replace(/\s+/g, "");
}

function stripParenthetical(value: string) {
  return value.replace(/[（(][^）)]*[）)]/g, "").trim();
}

function answerVariants(value: string) {
  const trimmed = value.trim();
  const variants = [trimmed, stripParenthetical(trimmed)];
  if (/^to\s+/i.test(trimmed)) variants.push(trimmed.replace(/^to\s+/i, "").trim());
  if (/\d/.test(trimmed)) variants.push(trimmed.replace(/,/g, ""));
  return variants;
}

export function splitAcceptedAnswers(value: string) {
  const protectedValue = value.replace(/(\d),(\d)/g, "$1__NUMBER_COMMA__$2");
  const parts = protectedValue
    .split(/[/／;；,，、\n]|(?:\s+or\s+)|(?:\s+或\s+)/i)
    .map((item) => item.replace(/__NUMBER_COMMA__/g, ",").trim())
    .filter(Boolean);
  return parts.flatMap(answerVariants);
}

function unique(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    if (!value) return false;
    const normalized = normalizeAnswer(value);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function buildAcceptedAnswers(correctAnswer: string, extraAnswers: string[] = []) {
  return unique([correctAnswer, ...answerVariants(correctAnswer), ...splitAcceptedAnswers(correctAnswer), ...extraAnswers.flatMap(answerVariants)]);
}

export function isStringCorrect(userAnswer: string, correctAnswer: string, acceptedAnswers: string[] = []) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  if (!normalizedUserAnswer) return false;
  return buildAcceptedAnswers(correctAnswer, acceptedAnswers).some((answer) => normalizeAnswer(answer) === normalizedUserAnswer);
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
    answer: item.korean,
    acceptedAnswers: [item.korean]
  }));
  const koToZh = vocabPool.slice(14, 20).map<QuizQuestion>((item) => ({
    id: `vocab-ko-zh-${item.id}`,
    itemType: "vocabulary",
    itemId: item.id,
    questionType: "vocab_ko_to_zh",
    prompt: item.korean,
    answer: item.meaning,
    acceptedAnswers: buildAcceptedAnswers(item.meaning, item.accepted_answers)
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
      answer: item.cloze_answer!,
      acceptedAnswers: [item.cloze_answer!]
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
        acceptedAnswers: [item.cloze_answer!],
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
