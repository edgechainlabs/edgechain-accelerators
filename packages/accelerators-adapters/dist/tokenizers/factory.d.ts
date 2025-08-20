import { TiktokenJsTokenizer } from './tiktoken-js.js';
import { TiktokenWasmTokenizer } from './tiktoken-wasm.js';
import { AccelOptions } from '@edgechain/accelerators-core';

interface TokenizerFactoryOptions extends AccelOptions {
    wasmModule?: any;
}
declare function createTokenizer(opts?: TokenizerFactoryOptions): Promise<TiktokenWasmTokenizer | TiktokenJsTokenizer>;

export { type TokenizerFactoryOptions, createTokenizer };
