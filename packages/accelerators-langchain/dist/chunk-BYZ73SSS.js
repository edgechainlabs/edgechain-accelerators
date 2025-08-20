// src/runnables/Tokenize.ts
import { Runnable } from "@langchain/core/runnables";
var TokenizeRunnable = class extends Runnable {
  constructor(tok) {
    super();
    this.tok = tok;
    // LangChain Runnable requires lc_namespace in recent versions
    this.lc_namespace = ["edgechain", "runnables"];
    this.lc_serializable = false;
  }
  async invoke(input) {
    return this.tok.count(input);
  }
};

export {
  TokenizeRunnable
};
