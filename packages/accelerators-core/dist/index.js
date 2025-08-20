// src/runtime.ts
function detectRuntime() {
  const g = globalThis;
  if (g?.EdgeRuntime) return "vercel";
  if (typeof g.WebSocketPair !== "undefined" && g.caches?.default) return "cloudflare";
  if (typeof navigator !== "undefined") return "browser";
  if (g.process?.release?.name === "node") return "node";
  return "unknown";
}
export {
  detectRuntime
};
