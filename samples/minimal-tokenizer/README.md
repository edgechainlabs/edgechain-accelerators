Minimal tokenizer + splitter demo

What this shows
- Runtime-aware factory picks WASM (edge) or JS (node)
- Fast token counting via tiktoken adapter
- Simple token-based splitting usable in LangChain flows

Run it
1) Install and build the workspace once
   pnpm i
   pnpm -w build

2) Run the sample
   pnpm -C samples/minimal-tokenizer start
   # or
   pnpm --filter @edgechain/sample-minimal start

Notes
- In Node, the factory defaults to the JS tokenizer. On Cloudflare/Vercel, it prefers WASM automatically.
- To force WASM, pass { useWasm: 'always', wasmModule } and provide tiktoken_bg.wasm as a module in bundlers (e.g. Vite/Workers).

