# Yodelay

Yodelay is a browser for trying a gRPC server on your machine. The page talks to a local proxy, and the proxy speaks gRPC. Unary, server streaming, client streaming, and bidirectional calls are all supported.

## Install

Node.js 20 or newer.

```sh
npm install
```

## Run

```sh
npm start
```

That starts three processes:

- the page on [http://localhost:3000](http://localhost:3000)
- the proxy on `127.0.0.1:4000`
- a demo gRPC server on port `8080`

Open the page, upload `protos/demo.proto`, and set the server address to:

```text
localhost:8080
```

Pick a service and a method. The request body is filled with JSON you can edit, then send.

`npm test` runs the Node test suite. `npm run audit:ci` fails if `npm audit` reports a moderate or higher finding.

## What the page keeps

Proto files, the entry file, the server address, TLS material, metadata, the selected method, the request body, the theme, and the last 50 calls are stored in this browser under `localStorage`. Refreshing the page uploads those proto files again, because the proxy only keeps them in memory.

Certificate and key PEMs stay in browser storage on this machine. They are not written into the repository. Leave TLS off for the demo server.

## TLS, metadata, and deadlines

Turn TLS on to send a server name, a CA PEM, and an optional client certificate and key. Metadata rows are sent as gRPC metadata. A timeout becomes the call deadline. Each response frame includes how many milliseconds have passed since the call started.
