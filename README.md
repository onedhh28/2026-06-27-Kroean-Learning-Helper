# 韓文學習資料庫 MVP

Next.js + Tailwind CSS + Supabase 的韓文學習資料庫基礎架構。

## 開發

```bash
npm install
npm run dev
```

若尚未設定 Supabase 環境變數，頁面會使用 mock 資料方便檢視 UI 與抽考流程。

## Supabase

1. 建立 Supabase 專案。
2. 將 `.env.example` 複製成 `.env.local`，填入 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
3. 到 Supabase SQL Editor 執行 `supabase/schema.sql`。

## 匯入 JSON 格式

```json
{
  "vocabulary": [
    {
      "korean": "날짜",
      "meaning": "日期 / date",
      "part_of_speech": "名詞",
      "chapters": ["第1課"],
      "source": "課本"
    }
  ],
  "grammar": [
    {
      "pattern": "N에 가요",
      "meaning_zh": "（平輩）去某地",
      "meaning_en": "go to a place",
      "cloze_question": "저는 학교__ 가요.",
      "cloze_answer": "에",
      "chapters": ["第1課"],
      "source": "課本"
    }
  ]
}
```

AI / OCR API 尚未實作，第一階段只預留欄位與介面。
