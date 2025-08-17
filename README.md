# News App

這是一個使用 Next.js 和 Strapi 的新聞應用程式。
<img width="1017" height="891" alt="image" src="https://github.com/user-attachments/assets/eed69fba-dc36-4250-bfd1-9e58e68c33b1" />
<img width="636" height="705" alt="image" src="https://github.com/user-attachments/assets/32e3ff3e-c625-45c4-b110-051dff9d7ee6" />
<img width="1625" height="1187" alt="螢幕擷取畫面 2025-08-12 004544" src="https://github.com/user-attachments/assets/0217a5da-2398-4d30-ab5f-834031e84d93" />


## 功能特色

- 顯示新聞列表
- 新增新聞項目到資料庫
- 支援封面圖片上傳
- 響應式設計
- 深色/淺色主題切換

## 架構說明

### 前端 (Next.js)
- 使用 App Router 架構
- Client Components 處理表單和狀態管理
- API Routes 處理與 Strapi 的通信

### 後端 (Strapi)
- Headless CMS 提供內容管理
- REST API 提供資料存取
- Media Library 處理圖片上傳

### API 端點
- `GET /api/news-list` - 獲取新聞列表
- `POST /api/news` - 新增新聞項目

## 環境設定

### 1. 設定環境變數

在 `news-app` 目錄下創建 `.env.local` 檔案：

```bash
# Strapi 配置
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_strapi_api_token_here
```

### 2. 獲取 Strapi API Token

1. 啟動 Strapi 服務：
   ```bash
   cd my-strapi
   npm run dev
   ```

2. 開啟瀏覽器訪問 `http://localhost:1337/admin`

3. 創建管理員帳號（如果是第一次使用）

4. 前往 `Settings > API Tokens > Create new API token`
   - Name: `News App Token`
   - Description: `Token for news app to create news items`
   - Token duration: `Unlimited`
   - Token type: `Full access`

5. 複製生成的 token 並貼到 `.env.local` 檔案中

## 啟動專案

### 1. 啟動 Strapi 後端

```bash
cd my-strapi
npm run dev
```

### 2. 啟動 Next.js 前端

```bash
cd news-app
npm run dev
```

前端將在 `http://localhost:3000` 運行

## 新增功能

在首頁的最後有一個「新增新聞」按鈕，點擊後會開啟一個表單，可以：

- 輸入新聞標題
- 輸入新聞內容
- 上傳封面圖片（可選）
- 自動設定發布時間

新增成功後，新聞列表會自動更新。

## 測試功能

訪問 `http://localhost:3000/test` 可以測試新增新聞功能。

## 技術架構

- **前端**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **後端**: Strapi 5 (Headless CMS)
- **資料庫**: SQLite (開發環境)
- **圖片上傳**: Strapi Media Library
- **狀態管理**: React Hooks (useState, useEffect)
- **API 通信**: Fetch API + Next.js API Routes

## 問題解決

### 已解決的問題
- `server-only` 指令與 client component 的衝突
- 環境變數在 client side 的存取限制
- 圖片 URL 的處理和轉換

### 解決方案
- 將 Strapi 相關的 API 調用移到 Next.js API Routes
- 使用 client component 處理表單和狀態
- 透過 API Routes 處理與 Strapi 的通信

## 注意事項

- 確保 Strapi 服務正在運行
- 確保環境變數正確設定
- 圖片上傳需要 Strapi 的 upload API 權限
- 新增成功後會自動重新載入新聞列表
- 支援深色/淺色主題切換
