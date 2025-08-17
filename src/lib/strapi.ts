// src/lib/strapi.ts

// === Types (依你提供的 JSON) ===
export type UploadFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes?: number;
  url: string;
};

export type UploadFile = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: UploadFormat;
    small?: UploadFormat;
    medium?: UploadFormat;
    large?: UploadFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string; // e.g. /uploads/xxx.jpg
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type RichTextNode = {
  type: string;
  text?: string;
  children?: RichTextNode[];
};

export type NewsItem = {
  id: number;
  documentId: string;
  title: string;
  content: RichTextNode[];
  // 你的資料同時可能出現 publishedat / publishedAt
  publishedat?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  cover?: UploadFile[];
};

export type NewsListResponse = {
  data: NewsItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type NewsOneResponse = {
  data: NewsItem;
};

// === UI utils ===
export function imageUrl(file?: UploadFile, prefer: 'large'|'medium'|'small'|'thumbnail'|'raw'='large'): string | undefined {
  if (!file) return;
  
  // 選擇最佳格式的 URL
  const f = file.formats ?? undefined;
  const imageUrl = prefer === 'raw' ? file.url :
    f?.[prefer]?.url ?? f?.medium?.url ?? f?.small?.url ?? f?.thumbnail?.url ?? file.url;
  
  // 現在 API 已經返回完整的絕對路徑，直接返回即可
  return imageUrl;
}

export function pickTitle(n: NewsItem) { return n.title; }

export function pickDate(n: NewsItem) {
  const iso = n.publishedAt || n.publishedat || n.createdAt;
  try { return new Date(iso).toLocaleString(); }
  catch { return iso; }
}

export function pickCover(n: NewsItem): UploadFile | undefined {
  const arr = n.cover ?? [];
  return arr[0];
}

// 只把 RTE JSON 的 paragraph + text 簡易輸出，避免空白頁
export function richTextToParagraphs(content?: RichTextNode[]) {
  if (!Array.isArray(content)) return [];
  return content
    .filter(n => n?.type === 'paragraph')
    .map(p => (p.children ?? []).map(c => c.text ?? '').join(''));
}
