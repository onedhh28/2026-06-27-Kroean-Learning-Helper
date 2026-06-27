import type { Grammar, QuizAnswer, QuizSession, UserSettings, Vocabulary } from "./types";

export const mockVocabulary: Vocabulary[] = [
  {
    id: "vocab-1",
    korean: "날짜",
    meaning: "日期 / date",
    part_of_speech: "名詞",
    origin: "漢字詞",
    example_sentence: "오늘 날짜가 어떻게 돼요?",
    related_words: "오늘, 내일",
    chapters: ["第1課"],
    source: "課本",
    quiz_count: 2,
    correct_streak: 2,
    familiarity: "no"
  },
  {
    id: "vocab-2",
    korean: "공부하다",
    meaning: "讀書 / study",
    part_of_speech: "動詞",
    origin: "漢字詞",
    example_sentence: "저는 학교에서 공부해요.",
    related_words: "학교",
    chapters: ["第1課", "第2課"],
    source: "自行補充",
    quiz_count: 3,
    correct_streak: 3,
    familiarity: "yes"
  },
  {
    id: "vocab-3",
    korean: "눈",
    meaning: "雪 / snow；眼睛 / eye",
    part_of_speech: "名詞",
    origin: "固有語",
    example_sentence: "눈이 와요.",
    related_words: "겨울",
    chapters: ["第2課"],
    source: "AI詢問",
    quiz_count: 1,
    correct_streak: 0,
    familiarity: "no"
  }
];

export const mockGrammar: Grammar[] = [
  {
    id: "grammar-1",
    pattern: "N에 가요",
    meaning_zh: "（平輩）去某地",
    meaning_en: "go to a place",
    example_sentence: "저는 학교에 가요.",
    cloze_question: "저는 학교__ 가요.",
    cloze_answer: "에",
    translation_question: "我要去學校。",
    translation_reference_answer: "저는 학교에 가요.",
    extra_vocab_explanation: "학교 = 學校",
    chapters: ["第1課"],
    source: "課本",
    quiz_count: 3,
    correct_streak: 3,
    familiarity: "yes"
  },
  {
    id: "grammar-2",
    pattern: "N에서 V",
    meaning_zh: "（平輩）在某地做某事",
    meaning_en: "do something at a place",
    example_sentence: "저는 학교에서 공부해요.",
    cloze_question: "저는 학교__ 공부해요.",
    cloze_answer: "에서",
    translation_question: "我在學校讀書。",
    translation_reference_answer: "저는 학교에서 공부해요.",
    extra_vocab_explanation: "공부하다 = 讀書",
    chapters: ["第2課"],
    source: "課本",
    quiz_count: 1,
    correct_streak: 1,
    familiarity: "no"
  }
];

export const mockSettings: UserSettings = {
  id: "settings-1",
  user_id: "mock-user",
  learning_start_date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
};

export const mockSessions: QuizSession[] = [
  {
    id: "session-1",
    date: new Date().toISOString().slice(0, 10),
    score_correct: 34,
    score_total: 40,
    selected_chapters: ["第1課", "第2課"]
  }
];

export const mockAnswers: QuizAnswer[] = [
  {
    id: "answer-1",
    quiz_session_id: "session-1",
    item_type: "vocabulary",
    item_id: "vocab-1",
    question_type: "vocab_zh_to_ko",
    question_text: "日期 / date",
    user_answer: "날짜",
    correct_answer: "날짜",
    is_correct: true
  },
  {
    id: "answer-2",
    quiz_session_id: "session-1",
    item_type: "grammar",
    item_id: "grammar-1",
    question_type: "grammar_cloze",
    question_text: "저는 학교__ 가요.",
    user_answer: "에",
    correct_answer: "에",
    is_correct: true
  }
];

export const allChapters = Array.from(
  new Set([...mockVocabulary.flatMap((item) => item.chapters), ...mockGrammar.flatMap((item) => item.chapters)])
).sort();
