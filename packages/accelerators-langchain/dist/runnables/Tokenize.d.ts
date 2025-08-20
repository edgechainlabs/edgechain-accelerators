import { Runnable } from '@langchain/core/runnables';
import { TokenizerPort } from '@edgechain/accelerators-core';

declare class TokenizeRunnable extends Runnable<string, number> {
    private tok;
    lc_namespace: string[];
    lc_serializable: boolean;
    constructor(tok: TokenizerPort);
    invoke(input: string): Promise<number>;
}

export { TokenizeRunnable };
