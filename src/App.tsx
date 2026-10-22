import { useEffect, useMemo, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-chrome";
import dog from "./scss/dog_vector.svg";
import { scaffoldMessage } from "../shared/scaffold.js";
import { CallHandle, startCall, uploadSession } from "./session";
import { HistoryItem, ProtoService, Workspace } from "./types";
import { loadWorkspace, saveWorkspace } from "./workspace";

const themes = ["dark-yellow", "light-yellow", "dark-green", "dark-blue"] as const;

export function App() {
  const [workspace, setWorkspace] = useState<Workspace>(() => loadWorkspace());
  const [services, setServices] = useState<ProtoService[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [notice, setNotice] = useState("");
  const [log, setLog] = useState("");
  const [view, setView] = useState<"test" | "settings">("test");
  const [active, setActive] = useState(false);
  const callRef = useRef<CallHandle | null>(null);
  const fileKey = workspace.files.map((file) => `${file.name}:${file.contents}`).join("\n") + workspace.entry;

  useEffect(() => {
    saveWorkspace(workspace);
  }, [workspace]);

  useEffect(() => {
    if (workspace.files.length === 0) return;
    let cancelled = false;
    uploadSession(workspace.files, workspace.entry)
      .then((result) => {
        if (cancelled) return;
        setSessionId(result.sessionId);
        setServices(result.services);
        setNotice("");
      })
      .catch((err: Error) => {
        if (!cancelled) setNotice(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [fileKey]);

  const service = services.find((item) => item.name === workspace.service);
  const method = service?.methods.find((item) => item.name === workspace.method);
  const aceTheme = workspace.theme === "light-yellow" ? "chrome" : "monokai";

  const fileSummary = useMemo(
    () => workspace.files.map((file) => file.name).join(", "),
    [workspace.files]
  );

  function patch(partial: Partial<Workspace>) {
    setWorkspace((current) => ({ ...current, ...partial }));
  }

  async function onFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const files = await Promise.all(
      Array.from(list).map(async (file) => ({ name: file.name, contents: await file.text() }))
    );
    patch({
      files,
      entry: files[0].name,
      service: "",
      method: "",
      body: "{\n}"
    });
    setLog("");
  }

  function chooseMethod(serviceName: string, methodName: string, body?: string) {
    const nextService = services.find((item) => item.name === serviceName);
    const nextMethod = nextService?.methods.find((item) => item.name === methodName);
    patch({
      service: serviceName,
      method: methodName,
      body: body ?? (nextMethod ? scaffoldMessage(nextMethod.request.fields) : "{\n}")
    });
    setActive(false);
    callRef.current?.close();
    callRef.current = null;
  }

  function append(text: string) {
    setLog((current) => `${current}${text}`);
  }

  function remember(status: string, elapsedMs: number | undefined, preview: string) {
    if (!method) return;
    const item: HistoryItem = {
      id: `${Date.now()}`,
      at: new Date().toISOString(),
      url: workspace.url,
      service: workspace.service,
      method: workspace.method,
      streamType: method.streamType,
      body: workspace.body,
      metadata: workspace.metadata,
      status,
      elapsedMs,
      preview
    };
    setWorkspace((current) => ({ ...current, history: [item, ...current.history].slice(0, 50) }));
  }

  function sendRequest() {
    if (!workspace.url.trim()) {
      setNotice("Enter a server address");
      return;
    }
    if (!sessionId || !method) {
      setNotice("Choose a proto, service, and method");
      return;
    }
    try {
      JSON.parse(workspace.body || "{}");
    } catch {
      setNotice("Request body is not valid JSON");
      return;
    }
    setNotice("");
    setLog(`Request:\n${workspace.body}\n`);
    setActive(true);
    let preview = "";
    callRef.current?.close();
    callRef.current = startCall(
      {
        sessionId,
        url: workspace.url.trim(),
        tls: workspace.tls,
        metadata: workspace.metadata.filter((row) => row.key),
        service: workspace.service,
        method: workspace.method,
        streamType: method.streamType,
        body: workspace.body,
        timeoutMs: Number(workspace.timeoutMs) || 0
      },
      (frame) => {
        const timing = frame.elapsedMs !== undefined ? ` (${frame.elapsedMs} ms)` : "";
        if (frame.type === "data") {
          preview = frame.message;
          append(`\nResponse${timing}:\n${frame.message}\n`);
        } else if (frame.type === "error") {
          preview = frame.message;
          append(`\nError${timing}:\n${frame.message}\n`);
        } else if (frame.type === "status") {
          append(`\nStatus${timing}: ${frame.message}\n`);
          setActive(false);
          remember(frame.message, frame.elapsedMs, preview);
          callRef.current?.close();
          callRef.current = null;
        }
      }
    );
  }

  function pushMessage() {
    try {
      JSON.parse(workspace.body || "{}");
    } catch {
      setNotice("Request body is not valid JSON");
      return;
    }
    append(`\nPush:\n${workspace.body}\n`);
    callRef.current?.send(workspace.body);
  }

  const streamType = method?.streamType || "";

  return (
    <div className="app" data-theme={workspace.theme}>
      <aside className="nav">
        <img src={dog} alt="Yodelay" />
        <button type="button" onClick={() => setView("test")} aria-label="Home">
          Home
        </button>
        <label className="upload">
          <input
            aria-label="Upload proto files"
            type="file"
            accept=".proto"
            multiple
            hidden
            onChange={(event) => {
              void onFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <span className="upload-button">Proto</span>
        </label>
        <button type="button" onClick={() => setView("settings")} aria-label="Settings">
          Theme
        </button>
      </aside>
      <main className="main">
        <header className="top">
          <h1 className="brand">Yodelay.io</h1>
          <span>{fileSummary}</span>
        </header>
        {view === "settings" ? (
          <section>
            <h2>Select a theme</h2>
            <div className="themes">
              {themes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  className={`swatch ${theme}`}
                  aria-label={theme}
                  onClick={() => patch({ theme })}
                />
              ))}
            </div>
          </section>
        ) : (
          <section>
            <p className="notice" role="status">{notice}</p>
            <div className="toolbar">
              <input
                className="url"
                aria-label="Server address"
                placeholder="localhost:8080"
                value={workspace.url}
                onChange={(event) => patch({ url: event.target.value })}
              />
              <select
                aria-label="Service"
                value={workspace.service}
                onChange={(event) => patch({ service: event.target.value, method: "", body: "{\n}" })}
              >
                <option value="">Select service</option>
                {services.map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
              <select
                aria-label="Method"
                value={workspace.method}
                onChange={(event) => chooseMethod(workspace.service, event.target.value)}
              >
                <option value="">Select method</option>
                {(service?.methods || []).map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
              {streamType && <em className="stream-type">Type: {streamType}</em>}
              {!active && (
                <button className="primary" type="button" onClick={sendRequest}>Send</button>
              )}
              {active && streamType === "serverStreaming" && (
                <button type="button" onClick={() => callRef.current?.cancel()}>Cancel</button>
              )}
              {active && (streamType === "clientStreaming" || streamType === "bidiStreaming") && (
                <>
                  <button type="button" onClick={pushMessage}>Push</button>
                  <button type="button" onClick={() => callRef.current?.end()}>End</button>
                </>
              )}
            </div>
            <details>
              <summary>TLS, metadata, and timeout</summary>
              <div className="tls">
                <label>
                  <input
                    type="checkbox"
                    checked={workspace.tls.enabled}
                    onChange={(event) => patch({ tls: { ...workspace.tls, enabled: event.target.checked } })}
                  />
                  {" "}TLS
                </label>
                {workspace.tls.enabled && (
                  <>
                    <input
                      type="text"
                      aria-label="TLS server name"
                      placeholder="server name"
                      value={workspace.tls.serverName}
                      onChange={(event) => patch({ tls: { ...workspace.tls, serverName: event.target.value } })}
                    />
                    <textarea className="pem" aria-label="CA PEM" placeholder="CA PEM" value={workspace.tls.caPem} onChange={(event) => patch({ tls: { ...workspace.tls, caPem: event.target.value } })} />
                    <textarea className="pem" aria-label="Client certificate PEM" placeholder="client certificate PEM" value={workspace.tls.certPem} onChange={(event) => patch({ tls: { ...workspace.tls, certPem: event.target.value } })} />
                    <textarea className="pem" aria-label="Client key PEM" placeholder="client key PEM" value={workspace.tls.keyPem} onChange={(event) => patch({ tls: { ...workspace.tls, keyPem: event.target.value } })} />
                  </>
                )}
                <label>
                  Timeout ms{" "}
                  <input
                    type="number"
                    aria-label="Timeout milliseconds"
                    min={0}
                    value={workspace.timeoutMs}
                    onChange={(event) => patch({ timeoutMs: Number(event.target.value) })}
                  />
                </label>
                <MetadataEditor
                  rows={workspace.metadata}
                  onChange={(metadata) => patch({ metadata })}
                />
              </div>
            </details>
            {workspace.files.length > 1 && (
              <label>
                Entry file{" "}
                <select
                  aria-label="Entry proto file"
                  value={workspace.entry}
                  onChange={(event) => patch({ entry: event.target.value })}
                >
                  {workspace.files.map((file) => (
                    <option key={file.name} value={file.name}>{file.name}</option>
                  ))}
                </select>
              </label>
            )}
            <div className="editors">
              <div>
                <label className="block">Editor</label>
                <AceEditor
                  mode="json"
                  theme={aceTheme}
                  name="request-editor"
                  value={workspace.body}
                  onChange={(body) => patch({ body })}
                  width="100%"
                  height="220px"
                  setOptions={{ useWorker: false, tabSize: 2 }}
                />
              </div>
              <div>
                <label className="block">Log</label>
                <AceEditor
                  mode="json"
                  theme={aceTheme}
                  name="response-log"
                  value={log}
                  readOnly
                  width="100%"
                  height="220px"
                  setOptions={{ useWorker: false, tabSize: 2 }}
                />
              </div>
            </div>
            <section className="history">
              <h2>History</h2>
              {workspace.history.length === 0 && <p>Calls you send are kept on this browser.</p>}
              {workspace.history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="history-item"
                  onClick={() => {
                    patch({
                      url: item.url,
                      service: item.service,
                      method: item.method,
                      body: item.body,
                      metadata: item.metadata
                    });
                    setView("test");
                  }}
                >
                  <span>{item.service}.{item.method}</span>
                  <small>{item.status}{item.elapsedMs !== undefined ? ` · ${item.elapsedMs} ms` : ""}</small>
                </button>
              ))}
            </section>
          </section>
        )}
        <footer className="footer">Built with care by the Yodelays</footer>
      </main>
    </div>
  );
}

function MetadataEditor({
  rows,
  onChange
}: {
  rows: { key: string; value: string }[];
  onChange: (rows: { key: string; value: string }[]) => void;
}) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  return (
    <div className="meta">
      <div className="meta-row">
        <input aria-label="Metadata key" placeholder="metadata key" value={key} onChange={(event) => setKey(event.target.value)} />
        <input aria-label="Metadata value" placeholder="metadata value" value={value} onChange={(event) => setValue(event.target.value)} />
        <button
          type="button"
          onClick={() => {
            if (!key.trim()) return;
            onChange([...rows, { key: key.trim(), value }]);
            setKey("");
            setValue("");
          }}
        >
          Add metadata
        </button>
      </div>
      {rows.map((row, index) => (
        <div className="meta-row" key={`${row.key}-${index}`}>
          <span>{row.key}: {row.value}</span>
          <button type="button" onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
