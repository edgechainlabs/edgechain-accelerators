export type EdgeRuntime = 'cloudflare' | 'vercel' | 'browser' | 'node' | 'unknown';

export function detectRuntime(): EdgeRuntime {
  const g = globalThis as any;
  if (g?.EdgeRuntime) return 'vercel';
  if (typeof g.WebSocketPair !== 'undefined' && g.caches?.default) return 'cloudflare';
  if (typeof navigator !== 'undefined') return 'browser';
  if (g.process?.release?.name === 'node') return 'node';
  return 'unknown';
}
