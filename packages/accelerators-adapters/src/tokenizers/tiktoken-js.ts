import type { TokenizerPort } from '@edgechain/accelerators-core';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

export class TiktokenJsTokenizer implements TokenizerPort {
  readonly name = 'tiktoken-js';
  private enc: Tiktoken;

  constructor(rankData: any = o200k_base) {
    this.enc = new Tiktoken(rankData);
  }

  async encode(text: string): Promise<number[]> {
    return this.enc.encode(text);
  }

  async count(text: string): Promise<number> {
    return this.enc.encode(text).length;
  }

  free(): void {/* no-op */}
}
