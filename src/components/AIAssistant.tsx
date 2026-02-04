import { useRef, useState } from "react";
import { askAiStream } from "../api/openai/stream";
import type { AIStatus } from "../api/openai/types";
import type { StreamController } from "../api/openai/types";
import { runFetchStream } from "../stream-lab/fetchStream";
import { runSseStream } from "../stream-lab/sseStream";

function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<AIStatus>("idle");
  const [output, setOutput] = useState("");
  const streamRef = useRef<StreamController | null>(null);

  async function handleAsk() {
    streamRef.current?.cancel();

    setOutput("");

    streamRef.current = askAiStream(question, {
      onChunk: (chunk) => {
        setOutput((prev) => prev + chunk);
      },
      onDone: () => {
        setStatus("done");
      },
      onError: () => setStatus("error"),
    });

    setStatus("streaming");
  }

  function handleCancel() {
    streamRef.current?.cancel();
    setStatus("idle");
  }

  return (
    <>
      <div>
        <h2>AI Assistant</h2>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something ..."
        />
        <button onClick={handleAsk} disabled={status === "streaming"}>
          Ask AI
        </button>
        {status === "streaming" && (
          <button onClick={handleCancel} disabled={status !== "streaming"}>
            Cancel
          </button>
        )}
        {status === "streaming" && <p>🧠 AI is thinking...</p>}
        {status === "streaming" && <pre>{output}</pre>}
        {status === "done" && (
          <div>
            ✅ Done: <br />
            {output !== "" ? <p>{output}</p> : "<empty request>"}
          </div>
        )}
        {status === "error" && <p style={{ color: "red" }}>❌ Error</p>}
      </div>
      <div>
        <h2>Fetch Stream Test</h2>
        <button onClick={runFetchStream}>Run Fetch Stream</button>
      </div>
      <div>
        <h2>SSE Stream Test</h2>
        <button onClick={runSseStream}>Run SSE Stream</button>
      </div>
    </>
  );
}
export default AiAssistant;
