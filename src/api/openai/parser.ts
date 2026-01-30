import type { StreamHandlers } from "./types";

export function parseOpenAIStreamResponse(
  response: ReadableStream<Uint8Array>,
  handlers: StreamHandlers,
) {
  const reader = response.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    reader.cancel();
  };

  const processChunk = (chunk: Uint8Array) => {
    if (cancelled) return;
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const dataLine = line.slice(6).trim();
      if (!dataLine) continue;
      if (dataLine === "[DONE]") {
        handlers.onDone?.();
        cancel();
        return;
      }

      try {
        const parsed = JSON.parse(dataLine);
        // ✅ Responses API streaming
        if (parsed.type === "response.output_text.delta") {
          const delta = parsed.delta;
          if (typeof delta === "string") {
            handlers.onChunk(delta);
          }
        } else if (parsed.type === "response.completed") {
          handlers.onDone?.();
          cancel();
          return;
        }
      } catch (e) {
        handlers.onError?.(e);
      }
    }
  };

  const readLoop = async () => {
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) break;
        processChunk(value);
      }
    } catch (e) {
      handlers.onError?.(e);
    }
  };

  readLoop();

  return { cancel };
}
