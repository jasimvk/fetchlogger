// Framework-agnostic core: patches window.fetch and keeps an in-memory log store
// with a simple pub/sub. No DOM, no React — usable anywhere.

export interface FetchLog {
  id: number;
  method: string;
  url: string;
  apiCode?: string;
  status?: number;
  elapsed?: number;
  reqBody?: unknown;
  resBody?: unknown;
  error?: string;
  pending: boolean;
  ts: number;
}

export interface InstallOptions {
  /** Max logs kept in memory (FIFO). Default 100. */
  maxLogs?: number;
  /** Pull a short label out of the parsed JSON request body (e.g. an API code). */
  getLabel?: (reqBody: unknown, url: string, method: string) => string | undefined;
  /** Capture response bodies (clones the response). Default true. */
  captureResponseBody?: boolean;
}

type Listener = (log: FetchLog) => void;

let _counter = 0;
let _originalFetch: typeof fetch | null = null;
let _maxLogs = 100;
let _opts: InstallOptions = {};
const _logs: FetchLog[] = [];
const _listeners = new Set<Listener>();

const emit = (log: FetchLog) => {
  const idx = _logs.findIndex((l) => l.id === log.id);
  if (idx >= 0) _logs[idx] = log;
  else {
    _logs.push(log);
    if (_logs.length > _maxLogs) _logs.shift();
  }
  _listeners.forEach((fn) => fn(log));
};

/** Subscribe to log events. Returns an unsubscribe function. */
export const subscribe = (fn: Listener): (() => void) => {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
};

/** Current snapshot of logs. */
export const getLogs = (): FetchLog[] => _logs.slice();

/** Clear the in-memory log list. */
export const clearLogs = (): void => {
  _logs.length = 0;
};

/** True if fetch is currently patched. */
export const isInstalled = (): boolean => _originalFetch !== null;

/**
 * Patch window.fetch to record every request/response into the store.
 * Idempotent. Returns an uninstall function that restores the original fetch.
 */
export const installFetchLogger = (options: InstallOptions = {}): (() => void) => {
  if (typeof window === "undefined" || !window.fetch) return () => {};
  if (_originalFetch) return uninstallFetchLogger;

  _opts = options;
  _maxLogs = options.maxLogs ?? 100;
  _originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input
      : input instanceof URL ? input.href
      : (input as Request).url;
    const method = (
      init?.method || (input instanceof Request ? input.method : "GET")
    ).toUpperCase();

    let reqBody: unknown;
    if (init?.body) {
      try { reqBody = JSON.parse(init.body as string); }
      catch { reqBody = String(init.body); }
    }
    const apiCode = _opts.getLabel ? _opts.getLabel(reqBody, url, method) : undefined;

    const id = ++_counter;
    const t0 = (typeof performance !== "undefined" ? performance.now() : Date.now());
    const base: FetchLog = { id, method, url, apiCode, reqBody, pending: true, ts: Date.now() };
    emit({ ...base });

    try {
      const response = await _originalFetch!(input as any, init);
      const elapsed = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - t0);

      let resBody: unknown;
      if (_opts.captureResponseBody !== false) {
        try {
          const clone = response.clone();
          const ct = response.headers.get("content-type") || "";
          resBody = ct.includes("application/json") ? await clone.json() : await clone.text();
        } catch { /* ignore */ }
      }
      emit({ ...base, status: response.status, elapsed, resBody, pending: false });
      return response;
    } catch (err: any) {
      const elapsed = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - t0);
      emit({ ...base, error: err?.message || "failed", elapsed, pending: false });
      throw err;
    }
  };

  return uninstallFetchLogger;
};

/** Restore the original window.fetch. */
export const uninstallFetchLogger = (): void => {
  if (typeof window === "undefined" || !_originalFetch) return;
  window.fetch = _originalFetch;
  _originalFetch = null;
};
