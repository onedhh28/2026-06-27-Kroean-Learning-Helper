import type { Vocabulary } from "./types";

export function courseSourceLabel(item: { source?: string | null; chapters: string[] }) {
  return item.source === "課本" ? item.chapters.join(", ") : "";
}

export function partOfSpeechBadgeClass(partOfSpeech?: string | null) {
  const value = (partOfSpeech || "").toLowerCase();
  if (value.includes("v") || value.includes("動")) return "bg-blue-50 text-blue-700 ring-blue-100";
  if (value.includes("n") || value.includes("名")) return "bg-slate-100 text-slate-700 ring-slate-200";
  if (value.includes("a") || value.includes("形")) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (value.includes("adv") || value.includes("副")) return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-stone-100 text-stone-700 ring-stone-200";
}

export function partOfSpeechLabel(item: Pick<Vocabulary, "part_of_speech">) {
  return item.part_of_speech || "未分類";
}
