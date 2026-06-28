# 韓文學習資料庫 MVP

Next.js + Tailwind CSS + Supabase 的韓文學習資料庫基礎架構。

## 開發

```bash
npm install
npm run dev
```

若尚未設定 Supabase 環境變數，頁面會使用 mock 資料方便檢視 UI 與抽考流程。

## 手機測試

手機和電腦需連到同一個 Wi-Fi，然後用區網模式啟動：

```bash
npm run dev:lan
```

在手機瀏覽器開啟：

```text
http://你的電腦區網IP:3000
```

例如目前這台電腦偵測到的區網 IP 是 `172.30.1.10`，可試：

```text
http://172.30.1.10:3000
```

若手機仍無法開啟，請確認 macOS 防火牆允許 Node.js/Next.js 接受區網連線，且手機沒有使用不同網段或 VPN。

若要離開家裡 Wi-Fi 後也能用手機開啟，請部署到 Vercel，並設定 Supabase 環境變數與資料庫 schema。

## Supabase

1. 建立 Supabase 專案。
2. 將 `.env.example` 複製成 `.env.local`，填入 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
3. 到 Supabase SQL Editor 執行 `supabase/schema.sql`。

## 匯入 JSON 格式

目前網頁匯入頁提供「解析資料」與「確認匯入」流程，但在 Supabase 尚未接上前只會做預覽與 mock 確認，不會永久寫入遠端資料庫。

```json
{
  "vocabulary": [
    {
      "korean": "날짜",
      "meaning": "日期 / date",
      "part_of_speech": "名詞",
      "chapters": ["1-1"],
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
      "chapters": ["1-1"],
      "source": "課本"
    }
  ]
}
```

AI / OCR API 尚未實作，第一階段只預留欄位與介面。
