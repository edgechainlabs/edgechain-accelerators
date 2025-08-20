import type { TokenizerPort } from '@edgechain/accelerators-core';
import { init, Tiktoken } from 'tiktoken/lite/init';
import cl100k_base from 'tiktoken/encoders/cl100k_base.json';

declare global {
  var __tiktoken_wasm_module: any | undefined;
}

let initialized = false;
async function ensureInit(wasmModule?: any) {
  if (initialized) return;
  const module = wasmModule ?? (globalThis as any).__tiktoken_wasm_module;
  if (!module) {
    throw new Error(
      "TiktokenWasmTokenizer: missing WASM module. " +
      "Import 'tiktoken/lite/tiktoken_bg.wasm?module' in your app and set (globalThis as any).__tiktoken_wasm_module = it, " +
      "or pass { wasmModule } to factory."
    );
  }
  await init((imports) => WebAssembly.instantiate(module, imports));
  initialized = true;
}

export class TiktokenWasmTokenizer implements TokenizerPort {
  readonly name = 'tiktoken-wasm';
  private enc: Tiktoken | null = null;
  private wasmModule?: any;

  constructor(wasmModule?: any) {
    this.wasmModule = wasmModule;
  }

  private async ensureEncoder() {
    await ensureInit(this.wasmModule);
    if (!this.enc) {
      this.enc = new Tiktoken(
        cl100k_base.bpe_ranks,
        cl100k_base.special_tokens,
        cl100k_base.pat_str
      );
    }
  }

  async encode(text: string): Promise<Uint32Array> {
    await this.ensureEncoder();
    return (this.enc as Tiktoken).encode(text);
  }

  async count(text: string): Promise<number> {
    const tokens = await this.encode(text);
    return tokens.length;
  }

  free(): void {
    this.enc?.free();
    this.enc = null;
  }
}
