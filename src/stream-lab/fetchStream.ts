export async function runFetchStream() {
  const res = await fetch("http://localhost:3001/api/stream-lab");

  if (!res.body) {
    throw new Error("No response body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  console.log("=== STREAM START ===");

  while (true) {
    const { value, done } = await reader.read();

    console.log("chunk:", value, "done:", done);

    if (done) break;

    const text = decoder.decode(value, { stream: false });
    console.log("decoded:", JSON.stringify(text));
  }

  console.log("=== STREAM END ===");
}
