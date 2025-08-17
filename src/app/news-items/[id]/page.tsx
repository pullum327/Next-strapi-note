'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { imageUrl, pickTitle, pickDate, pickCover, richTextToParagraphs, type NewsItem } from "@/lib/strapi";
import SideAssistant from "@/components/SideAssistant";

type PageProps = { params: Promise<{ id: string }> };

export default function NewsDetailPage({ params }: PageProps) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const { id: documentId } = await params;
        const response = await fetch(`/api/news/${documentId}`);
        
        if (response.status === 404) {
          notFound();
          return;
        }
        
        if (!response.ok) {
          throw new Error('獲取新聞項目失敗');
        }
        
        const result = await response.json();
        setNewsItem(result.data);
      } catch (err) {
        console.error('獲取新聞項目時發生錯誤:', err);
        setError(err instanceof Error ? err.message : '未知錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItem();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              {/* 標題骨架 */}
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              
              {/* 圖片骨架 */}
              <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              
              {/* 內容骨架 */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">載入失敗</h2>
            <p className="text-gray-600 dark:text-gray-300">{error || '新聞項目不存在'}</p>
          </div>
        </div>
      </div>
    );
  }

  const title = pickTitle(newsItem);
  const when = pickDate(newsItem);
  const coverUrl = imageUrl(pickCover(newsItem), "large");
  const paragraphs = richTextToParagraphs(newsItem.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 返回按鈕 */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回新聞列表
            </Link>
          </div>

          {/* 主要內容卡片 */}
          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* 標題區域 */}
            <div className="p-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {when}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                {title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  發布時間：{when}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {paragraphs.length} 段內容
                </div>
              </div>
            </div>

            {/* 封面圖片 */}
            {coverUrl && (
              <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                <Image 
                  src={coverUrl} 
                  alt={title} 
                  fill 
                  className="object-cover" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            )}

            {/* 文章內容 */}
            <div className="p-8 pt-6">
              {paragraphs.length > 0 ? (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {paragraphs.map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">（本文為空）</p>
                </div>
              )}
            </div>
          </article>

          {/* AI 助理 */}
          <div className="mt-8">
            <SideAssistant title={title} />
          </div>
        </div>
      </div>
    </div>
  );
}
