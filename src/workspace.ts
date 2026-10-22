import { Workspace } from "./types";

export const WORKSPACE_KEY = "yodelay.workspace.v1";

export const emptyTls = {
  enabled: false,
  serverName: "",
  caPem: "",
  certPem: "",
  keyPem: ""
};

export function emptyWorkspace(): Workspace {
  return {
    files: [],
    entry: "",
    url: "",
    tls: { ...emptyTls },
    metadata: [],
    service: "",
    method: "",
    body: "{\n}",
    theme: "dark-yellow",
    timeoutMs: 0,
    history: []
  };
}

export function loadWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return emptyWorkspace();
    const saved = JSON.parse(raw) as Partial<Workspace>;
    return {
      ...emptyWorkspace(),
      ...saved,
      tls: { ...emptyTls, ...(saved.tls || {}) },
      files: saved.files || [],
      metadata: saved.metadata || [],
      history: (saved.history || []).slice(0, 50)
    };
  } catch {
    return emptyWorkspace();
  }
}

export function saveWorkspace(workspace: Workspace) {
  const next = {
    ...workspace,
    history: workspace.history.slice(0, 50)
  };
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next));
}
