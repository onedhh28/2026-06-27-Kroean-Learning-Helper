"use client";

import { useMemo, useState } from "react";
import type { Grammar } from "@/lib/types";
import { LibraryFilters } from "./LibraryFilters";

type GrammarListProps = {
  items: Grammar[];
  chapters: string[];
  sources: string[];
};

export function GrammarList({ items, chapters, sources }: GrammarListProps) {
  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState("");
  const [source, setSource] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesKeyword =
        !keyword ||
        [
          item.pattern,
          item.meaning_zh,
          item.meaning_en,
          item.example_sentence,
          item.cloze_question,
          item.translation_question,
          item.extra_vocab_explanation
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(keyword));
      const matchesChapter = !chapter || item.chapters.includes(chapter);
      const matchesSource = !source || item.source === source;
      return matchesKeyword && matchesChapter && matchesSource;
    });
  }, [chapter, items, search, source]);

  return (
    <>
      <LibraryFilters
        chapters={chapters}
        sources={sources}
        search={search}
        setSearch={setSearch}
        chapter={chapter}
        setChapter={setChapter}
        source={source}
        setSource={setSource}
      />

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">句型</th>
              <th className="px-4 py-3">中文</th>
              <th className="px-4 py-3">例句</th>
              <th className="px-4 py-3">章節</th>
              <th className="px-4 py-3">來源</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-4 text-base font-black text-ink">{item.pattern}</td>
                <td className="whitespace-pre-line px-4 py-4 text-slate-700">{item.meaning_zh}</td>
                <td className="px-4 py-4 text-slate-600">{item.example_sentence || "-"}</td>
                <td className="px-4 py-4 text-slate-600">{item.chapters.join(", ") || "-"}</td>
                <td className="px-4 py-4 text-slate-600">{item.source || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((item) => (
          <article key={item.id} className="panel p-4">
            <h2 className="text-xl font-black text-ink">{item.pattern}</h2>
            <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-slate-700">{item.meaning_zh}</p>
            {item.example_sentence ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.example_sentence}</p> : null}
            <p className="mt-3 text-xs text-slate-500">{item.chapters.join(", ") || "未分類"} · {item.source || "未標示來源"}</p>
          </article>
        ))}
      </div>
    </>
  );
}
