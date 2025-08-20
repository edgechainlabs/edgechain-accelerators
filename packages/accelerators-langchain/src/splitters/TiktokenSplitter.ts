import { Runnable } from '@langchain/core/runnables';
import type { TokenizerPort } from '@edgechain/accelerators-core';

export class TiktokenSplitter extends Runnable<string, string[]> {
  // Satisfy Runnable abstract members for current @langchain/core
  lc_namespace: string[] = ['edgechain', 'splitters'];
  lc_serializable = false;

  constructor(private tok: TokenizerPort, private maxTokens = 800, private overlap = 100) { super(); }

  async invoke(text: string): Promise<string[]> {
    const tokens = await this.tok.encode(text);
    const chunks: string[] = [];
    const step = Math.max(1, this.maxTokens - this.overlap);

    for (let start = 0; start < tokens.length; start += step) {
      const end = Math.min(tokens.length, start + this.maxTokens);
      const startRatio = start / tokens.length;
      const endRatio = end / tokens.length;
      const s = Math.floor(text.length * startRatio);
      const e = Math.max(s + 1, Math.floor(text.length * endRatio));
      chunks.push(text.slice(s, e));
      if (end === tokens.length) break;
    }
    return chunks;
  }
}
