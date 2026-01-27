import type { StreamController, StreamHandlers } from "./types";

import { parseOpenAIStreamResponse } from "./parser";

export function askAiStream(
  prompt: string,
  handlers: StreamHandlers,
): StreamController {
  const controller = new AbortController();

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`,
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    }),
  })
    .then(async (res) => {
      if (!res.body) throw new Error("Response body is null");
      await parseOpenAIStreamResponse(res.body, handlers);
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        handlers.onError?.(err);
      }
    });

  return {
    cancel: () => controller.abort(),
  };
}
