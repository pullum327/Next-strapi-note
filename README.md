Next + Strapi Note（SSE Drawer）
用 Next.js App Router 連 Strapi v5 顯示新聞列表／詳情，並提供一個側滑 AI 助理（SSE 串流）可回答「本頁面標題詳情」(用作筆記想快速理解更多內容)。
UI 採 Tailwind v4 + CSS 變數，不修改 tailwind.config；深／淺色主題以 useContext 管理並記憶使用者選擇。
<img width="1812" height="1176" alt="image" src="https://github.com/user-attachments/assets/db9f6cd3-e4af-44b4-b1d0-a9ceeea22001" />
<img width="1625" height="1187" alt="image" src="https://github.com/user-attachments/assets/52dfb3a1-08b4-4f1b-a433-0febb4c03fb8" />


✨ 功能
Note 清單頁 /（卡片樣式、圖片、發佈時間）

詳情頁 /news-items/[documentId]

側滑 AI 助理：右下角按鈕 → 抽屜開啟 → 以 SSE 串流回覆

深／淺色主題切換（<html data-theme="light|dark"> + CSS 變數）

Sticky Footer（內容不足時依然貼底）

圖片使用 Next <Image/>，已允許載入 Strapi 的 /uploads/**

🧱 技術棧
Next.js（App Router，Next 15 相容）

Tailwind CSS v4（不動 config；@import "tailwindcss"）

Strapi v5（REST API）

SSE（前端用 sse.js、後端可用 Express + LangChain/OpenAI 或自建 LLM）

TypeScript

 路由
/：新聞列表（取自 GET /api/news-items?populate=*）

/news-items/[id]：新聞詳情

Strapi v5 的單筆查詢請使用 documentId（不是數字 id）。因此本專案的 [id] 其實是 documentId。

🎛️ 深／淺色主題
使用 ThemeContext（useContext）管理，將主題寫入 <html data-theme="...">

顏色以 CSS 變數 控制（--text, --muted, --border, --card, --bg）

UI 使用 Tailwind 原子類（例如 bg-[var(--card)]、text-[var(--text)]），不需修改 tailwind.config

🧩 側滑 AI 助理（SSE）
元件：src/components/SideAssistant.tsx

啟動方式：詳情頁右下角「AI」按鈕 → 抽屜開啟 → 點「問 AI（SSE）：這頁標題？」

請在 .env.local 設定：NEXT_PUBLIC_SSE_BASE 指向你的 SSE 服務

前端透過 sse.js 連線，例如：

ts
複製
編輯
const input = `這個頁面的 title 是什麼？僅輸出標題原文。\ncontext: title="${title}"`;
const url = `${SSE_BASE}/chat?message=${encodeURIComponent(input)}`;
const source = new SSE(url);
source.stream(); // 開始串流
// 'message' 持續接收字串，最後收到 "[DONE]" 結束
