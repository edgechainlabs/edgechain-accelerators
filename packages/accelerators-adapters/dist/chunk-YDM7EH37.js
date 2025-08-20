// src/tokenizers/tiktoken-js.ts
import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";
var TiktokenJsTokenizer = class {
  constructor(rankData = o200k_base) {
    this.name = "tiktoken-js";
    this.enc = new Tiktoken(rankData);
  }
  async encode(text) {
    return this.enc.encode(text);
  }
  async count(text) {
    return this.enc.encode(text).length;
  }
  free() {
  }
};

export {
  TiktokenJsTokenizer
};
