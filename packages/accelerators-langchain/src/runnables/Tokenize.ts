import { Runnable } from '@langchain/core/runnables';
import type { TokenizerPort } from '@edgechain/accelerators-core';

export class TokenizeRunnable extends Runnable<string, number> {
  // LangChain Runnable requires lc_namespace in recent versions
  lc_namespace: string[] = ['edgechain', 'runnables'];
  lc_serializable = false;

  constructor(private tok: TokenizerPort) { super(); }

  async invoke(input: string): Promise<number> {
    return this.tok.count(input);
  }
}
