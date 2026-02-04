export async function runFetchStream() {
  const controller = new AbortController();
  const res = await fetch("http://localhost:3001/api/stream-lab", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },

    signal: controller.signal,
  });

  if (!res.body) {
    throw new Error("No response body");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  console.log("=== STREAM START ===");
  setTimeout(() => controller.abort(), 500);

  while (true) {
    const { value, done } = await reader.read();

    console.log("chunk:", value, "done:", done);

    if (done) break;

    const text = decoder.decode(value, { stream: true });
    console.log("decoded:", JSON.stringify(text));
  }

  console.log("=== STREAM END ===");
}
