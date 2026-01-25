import type { StreamHandler } from "../types/StreamHandler.js";

export async function fakeStream(
  text: string,
  onChunk: StreamHandler,
  signal?: { cancelled: () => boolean },
) {
  for (let i = 0; i < text.length; i++) {
    if (signal?.cancelled()) break;
    await new Promise((r) => setTimeout(r, 50));
    onChunk(text[i]);
  }
}
