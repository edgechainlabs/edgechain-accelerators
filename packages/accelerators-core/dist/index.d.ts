interface TokenizerPort {
    readonly name: string;
    encode(text: string): Promise<Uint32Array | number[]>;
    count(text: string): Promise<number>;
    free?(): void | Promise<void>;
}

type EdgeRuntime = 'cloudflare' | 'vercel' | 'browser' | 'node' | 'unknown';
declare function detectRuntime(): EdgeRuntime;

type WasmPolicy = 'auto' | 'always' | 'never';
interface AccelOptions {
    useWasm?: WasmPolicy;
    minBytesForWasm?: number;
}

export { type AccelOptions, type EdgeRuntime, type TokenizerPort, type WasmPolicy, detectRuntime };
