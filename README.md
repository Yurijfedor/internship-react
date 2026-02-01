# AI Streaming Module

## 1. Purpose

This module implements **streaming interaction with the OpenAI API** and provides:

- real-time text streaming (SSE)
- request cancellation support
- error handling
- clean integration with a React UI

The module is designed so that **the UI is completely decoupled from OpenAI API details**.

## 2. Folder Structure

api/
└── openai/
├── types.ts // public streaming types
├── stream.ts // HTTP + AbortController
├── parser.ts // SSE stream parser
components/
└── AiAssistant.tsx // UI component

## 3. Data Types

### `StreamHandlers`

```ts
export type StreamHandlers = {
  onChunk: (chunk: string) => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
};
```

### Description:

onChunk — called for each received text chunk

onDone — called when the stream finishes or is cancelled

onError — called on network or parsing errors

### StreamController

```ts
export type StreamController = {
  cancel: () => void;
};
```

Used by the UI to manually stop the stream.

## 4. API: askAiStream

```ts
askAiStream(prompt: string, handlers: StreamHandlers): StreamController
```

### Description

Sends a prompt to OpenAI and starts processing a streaming response.

### Lifecycle

- UI calls askAiStream

- AbortController is created

- fetch request is sent with stream: true

- parser.ts consumes the SSE stream

- UI receives partial text via onChunk

- On completion or cancel → onDone

## 5. SSE Parser (parser.ts)

### Responsibility

- reads from ReadableStream

- buffers incomplete lines

- processes data: {...} messages

- ignores malformed or partial chunks

- correctly terminates on [DONE]

### Key Principles

- does not throw on every malformed chunk

- UI is unaware of SSE formatting

- parser has no dependency on React

## 6. UI Integration (AiAssistant)

### Data Flow

User input
↓
askAiStream()
↓
onChunk → setOutput
↓
onDone → status = "done"

## 7. Cancellation Handling

- cancel():

- calls AbortController.abort()

- terminates the SSE stream

- triggers onDone

This guarantees the UI always reaches a final consistent state.

## Final Notes

### This module demonstrates:

- separation of concerns

- controllable streaming lifecycle

- production-oriented API design

It can be safely reused or extended when moving streaming logic to a backend service.

## Links

Live Demo:
https://aiassistant-frontend-eight.vercel.app

Backend API:
https://aiassistant-backend-production.up.railway.app

This project demonstrates secure AI streaming architecture using OpenAI Responses API and SSE.
