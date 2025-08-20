// src/tokenizers/factory.ts
import { detectRuntime } from "@edgechain/accelerators-core";
async function createTokenizer(opts = {}) {
  const { useWasm = "auto", minBytesForWasm = 8e3, wasmModule } = opts;
  const runtime = detectRuntime();
  const preferWasm = useWasm === "always" || useWasm === "auto" && (runtime === "cloudflare" || runtime === "vercel");
  if (preferWasm) {
    try {
      const { TiktokenWasmTokenizer } = await import("./tokenizers/tiktoken-wasm.js");
      return new TiktokenWasmTokenizer(wasmModule);
    } catch {
    }
  }
  const { TiktokenJsTokenizer } = await import("./tokenizers/tiktoken-js.js");
  return new TiktokenJsTokenizer();
}

export {
  createTokenizer
};
