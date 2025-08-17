import OpenAI from "openai";

export const runtime = "nodejs"; // OpenAI SDK 需 Node runtime

export async function GET(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }

  const url = new URL(req.url);
  const question = url.searchParams.get("q") || "";
  const context = url.searchParams.get("ctx") || "";

  if (!question.trim()) {
    return new Response("Missing 'q' (question)", { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const encoder = new TextEncoder();

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    stream: true,
    messages: [
      { role: "system", content: "你是簡潔的助理，使用繁體中文回答。" },
      {
        role: "user",
        content:
          `${question}\n\n` +
          (context ? `已知的資料（context）：${context}\n` : "") +
          `若 context 已含答案，請直接回答；不要編造。僅輸出答案本身。`,
      },
    ],
  });

  const body = new ReadableStream({
    async start(controller) {
      const send = (data: string) => controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      const sendEvent = (event: string, data: string) =>
        controller.enqueue(encoder.encode(`event: ${event}\n` + `data: ${data}\n\n`));

      try {
        for await (const part of stream) {
          const chunk = part?.choices?.[0]?.delta?.content ?? "";
          if (chunk) send(chunk); // 一個 token 一個 data: … 送出去
        }
        sendEvent("done", "[DONE]");
      } catch (e) {
        sendEvent("error", "stream_error");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Nginx 關閉緩衝，確保即時
    },
  });
}
