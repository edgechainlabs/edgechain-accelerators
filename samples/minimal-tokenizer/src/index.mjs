import { detectRuntime } from '@edgechain/accelerators-core';
import { createTokenizer } from '@edgechain/accelerators-adapters';
import { TiktokenSplitter, TokenizeRunnable } from '@edgechain/accelerators-langchain';

async function main() {
  const runtime = detectRuntime();
  console.log(`[demo] runtime: ${runtime}`);

  const tok = await createTokenizer();
  console.log(`[demo] tokenizer: ${tok.name}`);

  const sample = 'EdgeChain accelerators make tokenization fast on the edge!';
  console.log(`[demo] sample count:`, await tok.count(sample));

  const text = (
    'LangChain + EdgeChain: Bring WASM-accelerated utilities to edge runtimes. ' +
    'This demo uses tiktoken (JS in Node, WASM on Workers) to count tokens and split text into token-sized chunks. '
  ).repeat(8);

  console.log(`[demo] full text chars: ${text.length}`);
  console.log(`[demo] full text tokens: ${await tok.count(text)}`);

  const splitter = new TiktokenSplitter(tok, 80, 20);
  const chunks = await splitter.invoke(text);
  console.log(`[demo] chunks: ${chunks.length}`);

  for (let i = 0; i < Math.min(chunks.length, 5); i++) {
    const c = chunks[i];
    const n = await tok.count(c);
    console.log(`  [chunk ${i + 1}] chars=${c.length} tokens≈${n}`);
  }

  const tokenize = new TokenizeRunnable(tok);
  const n = await tokenize.invoke('Tokenize via LangChain Runnable');
  console.log(`[demo] runnable count: ${n}`);

  await tok.free?.();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

