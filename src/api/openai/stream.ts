import type { StreamController, StreamHandlers } from "./types";
import { parseOpenAIStreamResponse } from "./parser";

export function askAiStream(
  prompt: string,
  handlers: StreamHandlers,
): StreamController {
  const controller = new AbortController();

  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("VITE_BACKEND_URL is not defined");
  }

  fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: prompt }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.body) throw new Error("Response body is null");

      await parseOpenAIStreamResponse(res.body, handlers);
    })
    .catch((err) => {
      if (err.name === "AbortError") {
        handlers.onDone?.();
        return;
      }
      handlers.onError?.(err);
    });

  return {
    cancel: () => {
      controller.abort();
      handlers.onDone?.();
    },
  };
}
