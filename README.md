# @jasimvkarim/fetchlogger

A live, in-page **fetch logger panel** for debugging API calls — see every request/response without opening DevTools. Framework-agnostic core with an optional React wrapper.

- 🛰 Floating panel, collapsible, draggable position
- 🔎 Filter by URL or API code
- ↑↓ Click a request to inspect request + response bodies
- ⚡ Zero dependencies in the core (React is an optional peer)
- 🧩 Works in React, Vue, Svelte, or plain JS

## Install

```bash
npm i -D @jasimvkarim/fetchlogger
```

## React

```tsx
import FetchLogger from "@jasimvkarim/fetchlogger/react";

export default function App() {
  return (
    <>
      {/* render once near the root */}
      {process.env.NODE_ENV !== "production" && <FetchLogger />}
      {/* ...your app... */}
    </>
  );
}
```

> Tip: gate it however you like — `NODE_ENV`, an env flag, or a branch. The
> package itself never gates; you decide where it shows.

## Any framework / plain JS

```ts
import { mountFetchLoggerPanel } from "@jasimvkarim/fetchlogger";

const unmount = mountFetchLoggerPanel({ position: "bottom-center" });
// later: unmount();
```

## Just the data (no UI)

```ts
import { installFetchLogger, subscribe } from "@jasimvkarim/fetchlogger";

installFetchLogger({ getLabel: (body) => (body as any)?.API_Code });
const off = subscribe((log) => console.log(log.method, log.url, log.status));
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `maxLogs` | `100` | Max logs kept in memory (FIFO). |
| `getLabel` | — | Derive a short label from the parsed JSON body (e.g. an API code). |
| `captureResponseBody` | `true` | Clone + read response bodies. |
| `defaultOpen` | `false` | Start expanded (panel only). |
| `position` | `"bottom-center"` | `bottom-center` \| `bottom-right` \| `bottom-left` (panel only). |
| `container` | `document.body` | Where to mount the panel. |
| `autoInstall` | `true` | Patch fetch on mount (panel only). |

## API

- `mountFetchLoggerPanel(options?) => () => void` — mount the floating panel, returns unmount.
- `installFetchLogger(options?) => () => void` — patch `fetch`, returns uninstall.
- `uninstallFetchLogger()` — restore original `fetch`.
- `subscribe(fn) => () => void` — listen to log events.
- `getLogs()` / `clearLogs()` / `isInstalled()`
- Types: `FetchLog`, `InstallOptions`, `MountOptions`.

## How it works

Patches `window.fetch`, recording method, URL, parsed JSON request/response
bodies, status, and timing into an in-memory store. The panel subscribes to the
store and renders live. It only touches the browser (`typeof window` guarded),
so it's safe to import in SSR — it no-ops on the server.

## License

MIT
