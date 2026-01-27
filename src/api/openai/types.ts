export type StreamHandlers = {
  onChunk: (chunk: string) => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
};

export type StreamController = {
  cancel: () => void;
};
