export type ProtoField = {
  name: string;
  type: string;
  repeated?: boolean;
  typeName?: string;
  fields?: ProtoField[];
  enumValues?: string[];
};

export type ProtoMethod = {
  name: string;
  streamType: string;
  request: { name: string; fields: ProtoField[] };
};

export type ProtoService = {
  name: string;
  methods: ProtoMethod[];
};

export type ProtoFile = {
  name: string;
  contents: string;
};

export type MetadataRow = {
  key: string;
  value: string;
};

export type TlsSettings = {
  enabled: boolean;
  serverName: string;
  caPem: string;
  certPem: string;
  keyPem: string;
};

export type HistoryItem = {
  id: string;
  at: string;
  url: string;
  service: string;
  method: string;
  streamType: string;
  body: string;
  metadata: MetadataRow[];
  status: string;
  elapsedMs?: number;
  preview: string;
};

export type Workspace = {
  files: ProtoFile[];
  entry: string;
  url: string;
  tls: TlsSettings;
  metadata: MetadataRow[];
  service: string;
  method: string;
  body: string;
  theme: string;
  timeoutMs: number;
  history: HistoryItem[];
};

export type ServerFrame = {
  type: "data" | "error" | "status";
  message: string;
  elapsedMs?: number;
};
