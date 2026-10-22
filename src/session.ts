import { MetadataRow, ProtoService, ServerFrame, TlsSettings } from "./types";

export async function uploadSession(files: { name: string; contents: string }[], entry: string) {
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files, entry })
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "could not read the proto files");
  }
  return body as { sessionId: string; services: ProtoService[] };
}

export type StartCall = {
  sessionId: string;
  url: string;
  tls: TlsSettings;
  metadata: MetadataRow[];
  service: string;
  method: string;
  streamType: string;
  body: string;
  timeoutMs: number;
};

export type CallHandle = {
  send: (body: string) => void;
  end: () => void;
  cancel: () => void;
  close: () => void;
};

export function startCall(payload: StartCall, onFrame: (frame: ServerFrame) => void): CallHandle {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  const socket = new WebSocket(`${protocol}://${location.host}/ws`);
  let opened = false;
  const queue: string[] = [];

  const flush = (message: object) => {
    const raw = JSON.stringify(message);
    if (opened && socket.readyState === WebSocket.OPEN) socket.send(raw);
    else queue.push(raw);
  };

  let settled = false;
  socket.addEventListener("open", () => {
    opened = true;
    queue.splice(0).forEach((raw) => socket.send(raw));
  });
  socket.addEventListener("message", (event) => {
    const frame = JSON.parse(String(event.data)) as ServerFrame;
    if (frame.type === "status") settled = true;
    onFrame(frame);
  });
  socket.addEventListener("close", () => {
    if (!settled) {
      settled = true;
      onFrame({ type: "status", message: "closed" });
    }
  });

  flush({ type: "start", ...payload });

  return {
    send(body: string) {
      flush({ type: "send", body });
    },
    end() {
      flush({ type: "end" });
    },
    cancel() {
      flush({ type: "cancel" });
    },
    close() {
      socket.close();
    }
  };
}
