export type Familiarity = "yes" | "no";

export type Vocabulary = {
  id: string;
  user_id?: string;
  korean: string;
  meaning: string;
  part_of_speech?: string | null;
  origin?: string | null;
  example_sentence?: string | null;
  related_words?: string | null;
  chapters: string[];
  source?: string | null;
  quiz_count: number;
  correct_streak: number;
  familiarity: Familiarity;
  created_at?: string;
  updated_at?: string;
};

export type Grammar = {
  id: string;
  user_id?: string;
  pattern: string;
  meaning_zh: string;
  meaning_en?: string | null;
  example_sentence?: string | null;
  cloze_question?: string | null;
  cloze_answer?: string | null;
  translation_question?: string | null;
  translation_reference_answer?: string | null;
  extra_vocab_explanation?: string | null;
  chapters: string[];
  source?: string | null;
  quiz_count: number;
  correct_streak: number;
  familiarity: Familiarity;
  created_at?: string;
  updated_at?: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  learning_start_date: string;
  created_at?: string;
  updated_at?: string;
};

export type QuizSession = {
  id: string;
  user_id?: string;
  date: string;
  score_correct: number;
  score_total: number;
  selected_chapters: string[];
  created_at?: string;
};

export type QuestionType =
  | "vocab_zh_to_ko"
  | "vocab_ko_to_zh"
  | "grammar_cloze"
  | "grammar_choice"
  | "grammar_translation";

export type QuizAnswer = {
  id: string;
  user_id?: string;
  quiz_session_id: string;
  item_type: "vocabulary" | "grammar";
  item_id: string;
  question_type: QuestionType;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  error_reason?: string | null;
  ai_judgement?: string | null;
  created_at?: string;
};

export type QuizQuestion = {
  id: string;
  itemType: "vocabulary" | "grammar";
  itemId: string;
  questionType: QuestionType;
  prompt: string;
  answer: string;
  options?: string[];
  selfGrade?: boolean;
};

export type ImportPayload = {
  vocabulary: Partial<Vocabulary>[];
  grammar: Partial<Grammar>[];
};
