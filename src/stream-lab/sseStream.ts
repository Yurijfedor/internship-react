export function runSseStream() {
  const es = new EventSource("http://localhost:3001/api/sse-lab");

  es.onmessage = (e) => {
    console.log("SSE:", e.data);
  };

  es.onerror = () => {
    console.log("SSE error");
    es.close();
  };
}
