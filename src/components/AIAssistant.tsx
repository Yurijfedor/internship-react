import { useRef, useState } from "react";
import { askAiStream } from "../api/openai/stream";
import type { AIStatus } from "../api/openai/types";
import type { StreamController } from "../api/openai/types";

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
      onDone: () => setStatus("done"),
      onError: () => setStatus("error"),
    });

    setStatus("streaming");
  }

  function handleCancel() {
    streamRef.current?.cancel();
    setStatus("idle");
  }

  console.log(output);

  return (
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
        <p>
          ✅ Done: <br />
          {output}
        </p>
      )}
      {status === "error" && <p style={{ color: "red" }}>❌ Error</p>}
    </div>
  );
}
export default AiAssistant;
