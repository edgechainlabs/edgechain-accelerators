// src/splitters/TiktokenSplitter.ts
import { Runnable } from "@langchain/core/runnables";
var TiktokenSplitter = class extends Runnable {
  constructor(tok, maxTokens = 800, overlap = 100) {
    super();
    this.tok = tok;
    this.maxTokens = maxTokens;
    this.overlap = overlap;
    // Satisfy Runnable abstract members for current @langchain/core
    this.lc_namespace = ["edgechain", "splitters"];
    this.lc_serializable = false;
  }
  async invoke(text) {
    const tokens = await this.tok.encode(text);
    const chunks = [];
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
};

export {
  TiktokenSplitter
};
