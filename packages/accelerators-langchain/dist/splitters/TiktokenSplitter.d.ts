import { Runnable } from '@langchain/core/runnables';
import { TokenizerPort } from '@edgechain/accelerators-core';

declare class TiktokenSplitter extends Runnable<string, string[]> {
    private tok;
    private maxTokens;
    private overlap;
    lc_namespace: string[];
    lc_serializable: boolean;
    constructor(tok: TokenizerPort, maxTokens?: number, overlap?: number);
    invoke(text: string): Promise<string[]>;
}

export { TiktokenSplitter };
