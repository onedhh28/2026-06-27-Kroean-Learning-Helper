"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import type { Grammar, Vocabulary } from "@/lib/types";

type AdminPanelProps = {
  vocabulary: Vocabulary[];
  grammar: Grammar[];
};

export function AdminPanel({ vocabulary, grammar }: AdminPanelProps) {
  const [vocabItems, setVocabItems] = useState(vocabulary);
  const [grammarItems, setGrammarItems] = useState(grammar);

  return (
    <div className="grid gap-6">
      <section className="panel p-5">
        <h2 className="text-xl font-black text-ink">管理單字</h2>
        <div className="mt-4 grid gap-3">
          {vocabItems.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-3 md:grid-cols-[180px_1fr_150px_160px]">
                <input className="field" value={item.korean} onChange={(event) => setVocabItems(updateById(vocabItems, item.id, { korean: event.target.value }))} />
                <input className="field" value={item.meaning} onChange={(event) => setVocabItems(updateById(vocabItems, item.id, { meaning: event.target.value }))} />
                <input className="field" value={item.part_of_speech || ""} onChange={(event) => setVocabItems(updateById(vocabItems, item.id, { part_of_speech: event.target.value }))} />
                <input className="field" value={item.source || ""} onChange={(event) => setVocabItems(updateById(vocabItems, item.id, { source: event.target.value }))} />
              </div>
              <AdminMeta quizCount={item.quiz_count} streak={item.correct_streak} familiarity={item.familiarity} />
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-secondary">
                  <Save className="h-4 w-4" />
                  儲存
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm(`確定刪除單字「${item.korean}」？此動作無法復原。`)) {
                      setVocabItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-xl font-black text-ink">管理文法</h2>
        <div className="mt-4 grid gap-3">
          {grammarItems.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-3 md:grid-cols-[220px_1fr_160px]">
                <input className="field" value={item.pattern} onChange={(event) => setGrammarItems(updateById(grammarItems, item.id, { pattern: event.target.value }))} />
                <textarea className="field min-h-20" value={item.meaning_zh} onChange={(event) => setGrammarItems(updateById(grammarItems, item.id, { meaning_zh: event.target.value }))} />
                <input className="field" value={item.source || ""} onChange={(event) => setGrammarItems(updateById(grammarItems, item.id, { source: event.target.value }))} />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <input className="field" value={item.cloze_question || ""} onChange={(event) => setGrammarItems(updateById(grammarItems, item.id, { cloze_question: event.target.value }))} placeholder="填空題" />
                <input className="field" value={item.cloze_answer || ""} onChange={(event) => setGrammarItems(updateById(grammarItems, item.id, { cloze_answer: event.target.value }))} placeholder="填空答案" />
              </div>
              <AdminMeta quizCount={item.quiz_count} streak={item.correct_streak} familiarity={item.familiarity} />
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-secondary">
                  <Save className="h-4 w-4" />
                  儲存
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm(`確定刪除文法「${item.pattern}」？此動作無法復原。`)) {
                      setGrammarItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function updateById<T extends { id: string }>(items: T[], id: string, patch: Partial<T>) {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

function AdminMeta({ quizCount, streak, familiarity }: { quizCount: number; streak: number; familiarity: string }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
      <span className="rounded-lg bg-slate-100 px-2 py-1">抽考 {quizCount} 次</span>
      <span className="rounded-lg bg-slate-100 px-2 py-1">連續答對 {streak} 次</span>
      <span className="rounded-lg bg-slate-100 px-2 py-1">熟悉度 {familiarity}</span>
    </div>
  );
}
