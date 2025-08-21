import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { detectRuntime } from '@edgechain/accelerators-core';
import { createTokenizer } from '@edgechain/accelerators-adapters';
import { TiktokenSplitter, TokenizeRunnable } from '@edgechain/accelerators-langchain';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const args = { file: path.join(__dirname, '..', 'data', 'sample.txt'), maxTokens: 200, overlap: 40, useWasm: false, compare: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file') args.file = argv[++i];
    else if (a === '--maxTokens') args.maxTokens = Number(argv[++i] ?? args.maxTokens);
    else if (a === '--overlap') args.overlap = Number(argv[++i] ?? args.overlap);
    else if (a === '--useWasm') args.useWasm = true;
    else if (a === '--compare') args.compare = true;
  }
  return args;
}

async function loadWasmBytes() {
  const wasmPath = require.resolve('tiktoken/lite/tiktoken_bg.wasm');
  return fs.promises.readFile(wasmPath);
}

async function makeTokenizer(forceWasm = false) {
  if (forceWasm) {
    const wasmBytes = await loadWasmBytes();
    return createTokenizer({ useWasm: 'always', wasmModule: wasmBytes });
  }
  return createTokenizer();
}

async function bench(name, tok, text, iters = 50) {
  const t0 = performance.now();
  let sum = 0;
  for (let i = 0; i < iters; i++) sum += await tok.count(text);
  const t1 = performance.now();
  return { name, ms: t1 - t0, tokens: sum / iters };
}

async function main() {
  const args = parseArgs(process.argv);
  const runtime = detectRuntime();
  console.log(`[doc-chunker] runtime=${runtime}`);
  console.log(`[doc-chunker] file=${args.file}`);

  const text = await fs.promises.readFile(args.file, 'utf8');
  console.log(`[doc-chunker] chars=${text.length}`);

  if (args.compare) {
    const tJS = await createTokenizer({ useWasm: 'never' });
    let results = [];
    results.push(await bench('js-tiktoken', tJS, text));
    try {
      const tWASM = await makeTokenizer(true);
      results.push(await bench('wasm-tiktoken', tWASM, text));
      await tWASM.free?.();
    } catch (e) {
      console.log('[doc-chunker] wasm not available in Node? falling back to JS.');
    }
    await tJS.free?.();
    for (const r of results) console.log(`  ${r.name}: ${r.ms.toFixed(1)}ms avgTokens≈${Math.round(r.tokens)}`);
    console.log('---');
  }

  const tok = await makeTokenizer(!!args.useWasm);
  console.log(`[doc-chunker] tokenizer=${tok.name}`);
  console.log(`[doc-chunker] totalTokens≈${await tok.count(text)}`);

  const splitter = new TiktokenSplitter(tok, args.maxTokens, args.overlap);
  const chunks = await splitter.invoke(text);
  console.log(`[doc-chunker] chunks=${chunks.length} (maxTokens=${args.maxTokens}, overlap=${args.overlap})`);

  // Show first few chunk stats
  for (let i = 0; i < Math.min(5, chunks.length); i++) {
    const c = chunks[i];
    const n = await tok.count(c);
    console.log(`  [chunk ${i + 1}] chars=${c.length} tokens≈${n}`);
  }

  // Runnable demonstration
  const tokenize = new TokenizeRunnable(tok);
  const demoCount = await tokenize.invoke('Runnable demo: count these tokens');
  console.log(`[doc-chunker] runnableCount=${demoCount}`);

  // Write outputs
  const outDir = path.join(__dirname, '..', 'out');
  await fs.promises.mkdir(outDir, { recursive: true });
  const out = {
    file: args.file,
    tokenizer: tok.name,
    totalChars: text.length,
    totalTokens: await tok.count(text),
    maxTokens: args.maxTokens,
    overlap: args.overlap,
    chunks: await Promise.all(chunks.map(async (c, i) => ({ index: i, chars: c.length, tokens: await tok.count(c), text: c })))
  };
  await fs.promises.writeFile(path.join(outDir, 'chunks.json'), JSON.stringify(out, null, 2));
  console.log(`[doc-chunker] wrote ${path.relative(process.cwd(), path.join(outDir, 'chunks.json'))}`);

  await tok.free?.();
}

main().catch((e) => { console.error(e); process.exit(1); });

