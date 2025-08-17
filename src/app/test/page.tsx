'use client';

import { useState } from 'react';
import AddNewsForm from '@/components/AddNewsForm';

export default function TestPage() {
  const [message, setMessage] = useState('');

  const handleNewsAdded = () => {
    setMessage('新聞新增成功！');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--text)] mb-8">測試新增新聞功能</h1>
      
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-4">功能說明</h2>
        <ul className="list-disc list-inside space-y-2 text-[var(--text)]">
          <li>點擊下方的「新增新聞」按鈕</li>
          <li>填寫標題和內容（必填）</li>
          <li>可選擇上傳封面圖片</li>
          <li>提交後會自動新增到 Strapi 資料庫</li>
        </ul>
      </div>

      <AddNewsForm onSuccess={handleNewsAdded} />
    </div>
  );
}
