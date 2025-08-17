# 環境變數設定說明

## 重要：設定環境變數

在 `news-app` 目錄下創建 `.env.local` 檔案，內容如下：

```bash
# Strapi 配置
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_strapi_api_token_here
```

## 環境變數說明

- **STRAPI_URL**: 用於 server-side API routes（必須）
- **NEXT_PUBLIC_STRAPI_URL**: 用於 client-side 組件（必須，用於圖片 URL 處理）
- **STRAPI_TOKEN**: Strapi API 認證 token（必須）

## 獲取 Strapi API Token 的步驟

### 1. 啟動 Strapi 服務
```bash
cd my-strapi
npm run dev
```

### 2. 訪問 Strapi Admin Panel
開啟瀏覽器訪問 `http://localhost:1337/admin`

### 3. 創建管理員帳號（如果是第一次使用）
- 填寫管理員資訊
- 設定密碼
- 完成註冊

### 4. 創建 API Token
1. 在左側選單點擊 `Settings`
2. 點擊 `API Tokens`
3. 點擊 `Create new API token`
4. 填寫以下資訊：
   - **Name**: `News App Token`
   - **Description**: `Token for news app to create news items`
   - **Token duration**: `Unlimited`
   - **Token type**: `Full access`
5. 點擊 `Save`
6. 複製生成的 token

### 5. 設定環境變數
將複製的 token 貼到 `.env.local` 檔案中的 `STRAPI_TOKEN` 欄位

## 圖片顯示問題解決

如果圖片無法正常顯示，請檢查：

1. **環境變數設定**：確保 `NEXT_PUBLIC_STRAPI_URL` 已正確設定
2. **Strapi 服務**：確保 Strapi 正在運行且可訪問
3. **權限設定**：確保 API Token 有讀取權限
4. **圖片格式**：確保上傳的圖片格式支援

## 注意事項

- 不要將 `.env.local` 檔案提交到版本控制
- 確保 Strapi 服務正在運行
- API Token 需要有 Full access 權限才能新增和上傳圖片
- 如果遇到權限問題，檢查 token 是否正確設定
- `NEXT_PUBLIC_` 前綴的環境變數會在 client side 暴露，請確保不包含敏感資訊

## 測試設定

設定完成後，重新啟動 Next.js 開發伺服器：

```bash
cd news-app
npm run dev
```

然後訪問 `http://localhost:3000` 測試新增功能和圖片顯示是否正常運作。
