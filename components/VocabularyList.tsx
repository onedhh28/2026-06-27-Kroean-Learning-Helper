"use client";

import { useMemo, useState } from "react";
import { courseSourceLabel, partOfSpeechBadgeClass, partOfSpeechLabel } from "@/lib/display";
import type { Vocabulary } from "@/lib/types";
import { LibraryFilters } from "./LibraryFilters";

type VocabularyListProps = {
  items: Vocabulary[];
  chapters: string[];
};

export function VocabularyList({ items, chapters }: VocabularyListProps) {
  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesKeyword =
        !keyword ||
        [item.korean, item.meaning, item.part_of_speech, item.origin, item.example_sentence, item.related_words]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(keyword));
      const matchesChapter = !chapter || item.chapters.includes(chapter);
      return matchesKeyword && matchesChapter;
    });
  }, [chapter, items, search]);

  return (
    <>
      <LibraryFilters chapters={chapters} search={search} setSearch={setSearch} chapter={chapter} setChapter={setChapter} />

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">韓文</th>
              <th className="px-4 py-3">意思</th>
              <th className="px-4 py-3">來源</th>
              <th className="px-4 py-3">詞性</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-4 text-lg font-black text-ink">{item.korean}</td>
                <td className="px-4 py-4 text-slate-700">{item.meaning}</td>
                <td className="px-4 py-4 text-slate-600">{courseSourceLabel(item) || "-"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${partOfSpeechBadgeClass(item.part_of_speech)}`}>
                    {partOfSpeechLabel(item)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((item) => (
          <article key={item.id} className="panel p-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-black text-ink">{item.korean}</h2>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${partOfSpeechBadgeClass(item.part_of_speech)}`}>
                {partOfSpeechLabel(item)}
              </span>
            </div>
            <p className="mt-2 text-base font-semibold text-slate-700">{item.meaning}</p>
            {item.example_sentence ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.example_sentence}</p> : null}
            <p className="mt-3 text-xs text-slate-500">來源：{courseSourceLabel(item) || "-"}</p>
          </article>
        ))}
      </div>
    </>
  );
}
