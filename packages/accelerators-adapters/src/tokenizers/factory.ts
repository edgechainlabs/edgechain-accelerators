import type { AccelOptions } from '@edgechain/accelerators-core';
import { detectRuntime } from '@edgechain/accelerators-core';

export interface TokenizerFactoryOptions extends AccelOptions {
  wasmModule?: any;
}

export async function createTokenizer(opts: TokenizerFactoryOptions = {}) {
  const { useWasm = 'auto', minBytesForWasm = 8_000, wasmModule } = opts;
  const runtime = detectRuntime();

  const preferWasm =
    useWasm === 'always' ||
    (useWasm === 'auto' && (runtime === 'cloudflare' || runtime === 'vercel'));

  if (preferWasm) {
    try {
      const { TiktokenWasmTokenizer } = await import('./tiktoken-wasm');
      return new TiktokenWasmTokenizer(wasmModule);
    } catch {
      // fall through
    }
  }

  const { TiktokenJsTokenizer } = await import('./tiktoken-js');
  return new TiktokenJsTokenizer();
}
