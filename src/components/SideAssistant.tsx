'use client';

import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore  // sse.js 沒有型別宣告，用 ts-ignore 略過
import {SSE} from 'sse.js';

type Props = { title: string };

// 你的 SSE 後端（Express /chat）基底網址；可在 .env.local 設 NEXT_PUBLIC_SSE_BASE
const DEFAULT_BASE = 'http://57.183.28.41:5000';
const SSE_BASE = process.env.NEXT_PUBLIC_SSE_BASE || DEFAULT_BASE;

export default function SideAssistant({ title }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partial, setPartial] = useState('');     // 串流中的文字
  const [finalText, setFinalText] = useState(''); // 完成後鎖定的答案
  const sourceRef = useRef<InstanceType<typeof SSE> | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Esc 關閉抽屜
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // 點 backdrop 關閉
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) setOpen(false);
  };

  // 啟動 SSE（固定問：這頁標題是什麼？並附上 context:title）
  const ask = () => {
    if (!title || loading) return;

    setLoading(true);
    setPartial('');
    setFinalText('');

    const input = `給我title的詳細說明。\ncontext: title="${title}"`;
    const url = `${SSE_BASE}/chat?message=${encodeURIComponent(input)}`;

    const source = new SSE(url);
    sourceRef.current = source;

    let buffer = '';
    source.addEventListener('message', (e: MessageEvent) => {
      const data = e.data as string;
      if (data === '[DONE]') {
        setFinalText(buffer || '(空白)');
        setLoading(false);
        source.close();
        sourceRef.current = null;
      } else {
        buffer += data;
        setPartial(buffer);
      }
    });

    source.addEventListener('error', (err: Event) => {
      console.error('SSE error', err);
      setFinalText('⚠️ 無法取得串流回應');
      setLoading(false);
      source.close();
      sourceRef.current = null;
    });

    // sse.js 需要顯式開啟
    source.stream();
  };

  // 取消串流
  const cancel = () => {
    sourceRef.current?.close();
    sourceRef.current = null;
    setLoading(false);
  };

  // 元件卸載時關閉串流
  useEffect(() => () => sourceRef.current?.close(), []);

  return (
    <>
      {/* 右下角浮動按鈕 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 border border-[var(--border)] bg-[var(--card)] text-[var(--text)] shadow hover:shadow-lg transition active:scale-95"
        aria-label="Open AI helper"
      >
        <span className="h-4 w-4 inline-block">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H7l-4 3V5a2 2 0 0 1 2-2h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        AI
      </button>

      {/* 側滑抽屜 */}
      {open && (
        <div
          ref={backdropRef}
          onClick={onBackdropClick}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        >
          <aside
            role="dialog" aria-modal="true" aria-label="AI 助理"
            className="absolute right-0 top-0 h-full w-[360px] max-w-[85vw] bg-[var(--card)] text-[var(--text)]
                       border-l border-[var(--border)] shadow-xl p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">頁面助理</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 border border-[var(--border)] hover:shadow active:scale-95"
                aria-label="Close"
              >
                關閉
              </button>
            </div>

            <p className="text-sm text-[var(--muted)] mb-3">
              根據目前頁面內容回答問題（SSE）。
            </p>

            <div className="space-y-2">
              <div className="text-sm">目前文章標題（context）</div>
              <div className="rounded-lg border border-[var(--border)] bg-black/5 dark:bg-white/5 p-3 text-sm">
                {title || '（無）'}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={ask}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-[var(--border)]
                           bg-[var(--card)] text-[var(--text)] shadow hover:shadow-md active:scale-95 disabled:opacity-60"
              >
                {loading ? '思考中…' : '問 AI（SSE）：給我title的詳細說明。'}
              </button>

              {loading && (
                <button
                  onClick={cancel}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-[var(--border)]
                             bg-[var(--card)] text-[var(--text)] shadow hover:shadow-md active:scale-95"
                >
                  取消
                </button>
              )}
            </div>

            <div className="mt-4">
              <div className="text-sm mb-1">回答（串流）</div>
              <div className="min-h-[72px] whitespace-pre-wrap rounded-lg border border-[var(--border)] p-3 text-sm">
                {partial || finalText || '（尚未詢問）'}
              </div>
            </div>

            <div className="mt-auto text-xs text-[var(--muted)]">
              * 後端：{SSE_BASE}/chat（逐段 data:…，以 [DONE] 結束）
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
