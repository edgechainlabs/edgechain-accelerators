// src/tokenizers/tiktoken-wasm.ts
import { init, Tiktoken } from "tiktoken/lite/init";
import cl100k_base from "tiktoken/encoders/cl100k_base.json";
var initialized = false;
async function ensureInit(wasmModule) {
  if (initialized) return;
  const module = wasmModule ?? globalThis.__tiktoken_wasm_module;
  if (!module) {
    throw new Error(
      "TiktokenWasmTokenizer: missing WASM module. Import 'tiktoken/lite/tiktoken_bg.wasm?module' in your app and set (globalThis as any).__tiktoken_wasm_module = it, or pass { wasmModule } to factory."
    );
  }
  await init((imports) => WebAssembly.instantiate(module, imports));
  initialized = true;
}
var TiktokenWasmTokenizer = class {
  constructor(wasmModule) {
    this.name = "tiktoken-wasm";
    this.enc = null;
    this.wasmModule = wasmModule;
  }
  async ensureEncoder() {
    await ensureInit(this.wasmModule);
    if (!this.enc) {
      this.enc = new Tiktoken(
        cl100k_base.bpe_ranks,
        cl100k_base.special_tokens,
        cl100k_base.pat_str
      );
    }
  }
  async encode(text) {
    await this.ensureEncoder();
    return this.enc.encode(text);
  }
  async count(text) {
    const tokens = await this.encode(text);
    return tokens.length;
  }
  free() {
    this.enc?.free();
    this.enc = null;
  }
};

export {
  TiktokenWasmTokenizer
};
