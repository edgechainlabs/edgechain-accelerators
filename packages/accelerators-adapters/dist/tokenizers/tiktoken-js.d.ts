import { TokenizerPort } from '@edgechain/accelerators-core';

declare class TiktokenJsTokenizer implements TokenizerPort {
    readonly name = "tiktoken-js";
    private enc;
    constructor(rankData?: any);
    encode(text: string): Promise<number[]>;
    count(text: string): Promise<number>;
    free(): void;
}

export { TiktokenJsTokenizer };
