"use client";

import { useMemo, useState } from "react";
import { parseImportText, findGrammarDuplicates, findVocabularyDuplicates } from "@/lib/importer";
import type { Grammar, Vocabulary } from "@/lib/types";

type ImportToolProps = {
  vocabulary: Vocabulary[];
  grammar: Grammar[];
};

export function ImportTool({ vocabulary, grammar }: ImportToolProps) {
  const [rawText, setRawText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const parsed = useMemo(() => parseImportText(rawText), [rawText]);
  const vocabPreview = useMemo(() => findVocabularyDuplicates(vocabulary, parsed.vocabulary), [parsed.vocabulary, vocabulary]);
  const grammarPreview = useMemo(() => findGrammarDuplicates(grammar, parsed.grammar), [grammar, parsed.grammar]);

  async function loadFile(file: File | undefined) {
    if (!file) return;
    setRawText(await file.text());
    setConfirmed(false);
  }

  const hasParsedItems = parsed.vocabulary.length > 0 || parsed.grammar.length > 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="panel p-5">
        <h2 className="text-xl font-black text-ink">步驟 1：貼上或上傳資料</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          第一版支援 JSON、簡單 Markdown 或純文字。AI 分析與圖片 OCR 暫時保留為後續介面。
        </p>
        <textarea
          className="field mt-4 min-h-72 w-full resize-y"
          placeholder="貼上 JSON、Markdown 或文字"
          value={rawText}
          onChange={(event) => {
            setRawText(event.target.value);
            setConfirmed(false);
          }}
        />
        <div className="mt-3">
          <label className="label mb-2 block">上傳 .txt / .md</label>
          <input
            className="block w-full text-sm text-slate-600 file:mr-4 file:min-h-11 file:rounded-lg file:border-0 file:bg-mint file:px-4 file:font-semibold file:text-teal"
            type="file"
            accept=".txt,.md,.json"
            onChange={(event) => loadFile(event.target.files?.[0])}
          />
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          OCR 圖片掃描與 AI 自動整理：第二階段實作。
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-xl font-black text-ink">步驟 2-4：解析、預覽、確認</h2>
        {!hasParsedItems ? (
          <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">尚未解析出單字或文法。</p>
        ) : (
          <div className="mt-4 space-y-5">
            <PreviewBlock title={`即將新增單字 ${parsed.vocabulary.length} 筆`}>
              {vocabPreview.map(({ item, duplicate, sameMeaning }, index) => (
                <div key={`${item.korean}-${index}`} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-black text-ink">{item.korean || "未填韓文"}</p>
                  <p className="mt-1 text-slate-700">{item.meaning || "未填意思"}</p>
                  {duplicate ? (
                    <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-coral">
                      {sameMeaning ? "完全重複，建議略過。" : `可能同詞多義：既有意思為 ${duplicate.meaning}`}
                    </p>
                  ) : null}
                </div>
              ))}
            </PreviewBlock>

            <PreviewBlock title={`即將新增文法 ${parsed.grammar.length} 筆`}>
              {grammarPreview.map(({ item, duplicate }, index) => (
                <div key={`${item.pattern}-${index}`} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-black text-ink">{item.pattern || "未填 pattern"}</p>
                  <p className="mt-1 whitespace-pre-line text-slate-700">{item.meaning_zh || "未填中文意思"}</p>
                  {duplicate ? <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-coral">此文法已存在，需選擇略過或更新。</p> : null}
                </div>
              ))}
            </PreviewBlock>

            <button className="btn-primary w-full" onClick={() => setConfirmed(true)}>
              確認存入資料庫
            </button>
            {confirmed ? (
              <p className="rounded-lg bg-mint p-3 text-sm font-semibold text-teal">
                MVP mock：已完成確認流程。接 Supabase 後在這裡批次寫入 vocabulary、grammar 與 import_batches。
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

function PreviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black text-slate-700">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}
