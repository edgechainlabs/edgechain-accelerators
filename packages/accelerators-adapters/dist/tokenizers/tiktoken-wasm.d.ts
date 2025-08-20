import { TokenizerPort } from '@edgechain/accelerators-core';

declare global {
    var __tiktoken_wasm_module: any | undefined;
}
declare class TiktokenWasmTokenizer implements TokenizerPort {
    readonly name = "tiktoken-wasm";
    private enc;
    private wasmModule?;
    constructor(wasmModule?: any);
    private ensureEncoder;
    encode(text: string): Promise<Uint32Array>;
    count(text: string): Promise<number>;
    free(): void;
}

export { TiktokenWasmTokenizer };
