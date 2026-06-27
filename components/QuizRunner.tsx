"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { buildQuiz, isStringCorrect } from "@/lib/quiz";
import type { Grammar, QuizQuestion, Vocabulary } from "@/lib/types";

type QuizRunnerProps = {
  vocabulary: Vocabulary[];
  grammar: Grammar[];
  chapters: string[];
};

export function QuizRunner({ vocabulary, grammar, chapters }: QuizRunnerProps) {
  const [selectedChapters, setSelectedChapters] = useState<string[]>(["全部"]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selfGrades, setSelfGrades] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      if (question.selfGrade) return total + (selfGrades[question.id] ? 1 : 0);
      return total + (isStringCorrect(answers[question.id] || "", question.answer) ? 1 : 0);
    }, 0);
  }, [answers, questions, selfGrades]);

  function toggleChapter(chapter: string) {
    setSelectedChapters((current) => {
      if (chapter === "全部") return ["全部"];
      const withoutAll = current.filter((item) => item !== "全部");
      return withoutAll.includes(chapter) ? withoutAll.filter((item) => item !== chapter) : [...withoutAll, chapter];
    });
  }

  function startQuiz() {
    const built = buildQuiz(vocabulary, grammar, selectedChapters.length ? selectedChapters : ["全部"]);
    setQuestions(built);
    setAnswers({});
    setSelfGrades({});
    setSubmitted(false);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <section className="panel h-fit p-5">
        <h2 className="text-xl font-black text-ink">抽考設定</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">題數固定為單字最多 20 題、句型最多 20 題；題庫不足時能出幾題就出幾題。</p>
        <div className="mt-4 grid gap-2">
          <button
            className={`btn-secondary justify-start ${selectedChapters.includes("全部") ? "border-teal bg-mint text-teal" : ""}`}
            onClick={() => toggleChapter("全部")}
          >
            全部
          </button>
          {chapters.map((chapter) => (
            <button
              key={chapter}
              className={`btn-secondary justify-start ${selectedChapters.includes(chapter) ? "border-teal bg-mint text-teal" : ""}`}
              onClick={() => toggleChapter(chapter)}
            >
              {chapter}
            </button>
          ))}
        </div>
        <button className="btn-primary mt-5 w-full" onClick={startQuiz}>
          產生今日抽考
        </button>
      </section>

      <section className="space-y-4">
        {questions.length === 0 ? (
          <div className="panel p-8 text-center">
            <p className="text-lg font-black text-ink">尚未產生考題</p>
            <p className="mt-2 text-sm text-slate-600">選擇章節後開始抽考。</p>
          </div>
        ) : (
          <>
            <div className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">本次題數</p>
                <p className="text-2xl font-black text-ink">{questions.length} 題</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={startQuiz}>
                  <RotateCcw className="h-4 w-4" />
                  重抽
                </button>
                <button className="btn-primary" onClick={() => setSubmitted(true)}>
                  <CheckCircle2 className="h-4 w-4" />
                  交卷
                </button>
              </div>
            </div>

            {submitted ? (
              <div className="panel border-teal bg-mint p-5">
                <p className="text-sm font-semibold text-teal">本次分數</p>
                <p className="mt-1 text-4xl font-black text-ink">
                  {score}/{questions.length}
                </p>
                <p className="mt-2 text-sm text-slate-600">MVP mock：接 Supabase 後會寫入 quiz_sessions、quiz_answers，並更新 quiz_count、correct_streak、familiarity。</p>
              </div>
            ) : null}

            {questions.map((question, index) => {
              const userAnswer = answers[question.id] || "";
              const correct = question.selfGrade ? selfGrades[question.id] : isStringCorrect(userAnswer, question.answer);
              return (
                <article key={question.id} className="panel p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-teal">第 {index + 1} 題 · {labelForQuestion(question.questionType)}</p>
                      <h2 className="mt-2 text-xl font-black leading-8 text-ink">{question.prompt}</h2>
                    </div>
                    {submitted ? (
                      <span className={`rounded-lg px-3 py-1 text-sm font-black ${correct ? "bg-mint text-teal" : "bg-red-50 text-coral"}`}>
                        {correct ? "答對" : "答錯"}
                      </span>
                    ) : null}
                  </div>

                  {question.options ? (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          className={`btn-secondary justify-start ${userAnswer === option ? "border-teal bg-mint text-teal" : ""}`}
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      className="field mt-4 w-full text-base"
                      placeholder={question.selfGrade ? "輸入答案後自行標記答對 / 答錯" : "輸入答案"}
                      value={userAnswer}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                    />
                  )}

                  {question.selfGrade ? (
                    <div className="mt-3 flex gap-2">
                      <button
                        className={`btn-secondary ${selfGrades[question.id] ? "border-teal bg-mint text-teal" : ""}`}
                        onClick={() => setSelfGrades((current) => ({ ...current, [question.id]: true }))}
                      >
                        自評答對
                      </button>
                      <button
                        className={`btn-secondary ${selfGrades[question.id] === false ? "border-coral bg-red-50 text-coral" : ""}`}
                        onClick={() => setSelfGrades((current) => ({ ...current, [question.id]: false }))}
                      >
                        自評答錯
                      </button>
                    </div>
                  ) : null}

                  {submitted ? (
                    <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
                      <p className="font-semibold text-slate-500">正確答案 / 參考答案</p>
                      <p className="mt-1 text-ink">{question.answer}</p>
                      {question.questionType === "grammar_translation" ? (
                        <p className="mt-2 text-slate-600">AI 判分會在第二階段實作，目前先以自評或 placeholder 處理。</p>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}

function labelForQuestion(type: QuizQuestion["questionType"]) {
  return {
    vocab_zh_to_ko: "單字中翻韓",
    vocab_ko_to_zh: "單字韓翻中",
    grammar_cloze: "句型填空",
    grammar_choice: "句型選擇",
    grammar_translation: "整句翻譯"
  }[type];
}
