Doc Chunker (realistic CLI)

What it shows
- Tokenization via JS or WASM (optional) using tiktoken
- Token-based splitting with overlap for RAG-style pipelines
- Runnable integration (counts via LangChain Runnable)

Install/build (from repo root)
  pnpm i
  pnpm -w build

Run basic chunking
  pnpm -C samples/doc-chunker start -- --file samples/doc-chunker/data/sample.txt --maxTokens 200 --overlap 40

Force WASM in Node (loads tiktoken_bg.wasm directly)
  pnpm -C samples/doc-chunker start -- --file samples/doc-chunker/data/sample.txt --useWasm

Compare JS vs WASM speeds (simple micro-benchmark)
  pnpm -C samples/doc-chunker compare -- --file samples/doc-chunker/data/sample.txt

Notes
- In edge runtimes (Cloudflare/Vercel), the adapters auto-prefer WASM. In Node, use --useWasm to load the wasm binary.
- Outputs chunks and stats to samples/doc-chunker/out/chunks.json.

