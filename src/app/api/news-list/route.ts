import { NextResponse } from 'next/server';

// 定義圖片檔案的類型
interface ImageFile {
  url: string;
  formats?: {
    [key: string]: {
      url: string;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

// 定義新聞項目的類型
interface NewsItemData {
  cover?: ImageFile[];
  [key: string]: unknown;
}

// 處理圖片 URL 的輔助函數
function processImageUrls(data: NewsItemData, strapiUrl: string): NewsItemData {
  if (data.cover && Array.isArray(data.cover)) {
    data.cover = data.cover.map((file: ImageFile) => {
      if (file.url && !file.url.startsWith('http')) {
        file.url = new URL(file.url, strapiUrl).toString();
      }
      if (file.formats) {
        Object.keys(file.formats).forEach((format: string) => {
          const formatFile = file.formats![format];
          if (formatFile && formatFile.url && !formatFile.url.startsWith('http')) {
            formatFile.url = new URL(formatFile.url, strapiUrl).toString();
          }
        });
      }
      return file;
    });
  }
  return data;
}

export async function GET() {
  try {
    const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
    const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL) {
      return NextResponse.json(
        { error: 'STRAPI_URL 未設定' },
        { status: 500 }
      );
    }

    // 構建 Strapi API URL
    const url = new URL('/api/news-items', STRAPI_URL);
    url.searchParams.set('populate', '*');
    url.searchParams.set('pagination[pageSize]', '25');
    url.searchParams.set('sort', 'publishedAt:desc');

    const headers: Record<string, string> = {};
    if (STRAPI_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
    }

    const response = await fetch(url.toString(), { 
      headers,
      next: { revalidate: 60 } // 1 分鐘快取
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API 錯誤:', response.status, errorText);
      return NextResponse.json(
        { error: '獲取新聞列表失敗', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // 處理圖片 URL，確保返回完整的絕對路徑
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: NewsItemData) => processImageUrls(item, STRAPI_URL));
    }
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('獲取新聞列表時發生錯誤:', error);
    return NextResponse.json(
      { error: '伺服器錯誤', message: '獲取新聞列表失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
