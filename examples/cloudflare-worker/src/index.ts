import { ChatCloudflareWorkersAI, CloudflareWorkersAIEmbeddings, CloudflareVectorizeStore } from '@langchain/cloudflare';
import { RunnableSequence } from '@langchain/core/runnables';

import wasmModule from 'tiktoken/lite/tiktoken_bg.wasm?module';
(globalThis as any).__tiktoken_wasm_module = wasmModule;

import { createTokenizer } from '@edgechain/accelerators-adapters/tokenizers/factory';
import { TiktokenSplitter } from '@edgechain/accelerators-langchain/splitters/TiktokenSplitter';

export interface Env {
  AI: any; // wrangler.toml [ai] binding
  VEC: any; // wrangler.toml [[vectorize]] binding
}

export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    if (url.pathname === "/ask" && req.method === "POST") {
      const { q } = await req.json();

      const tok = await createTokenizer({ useWasm: 'auto' });
      const splitter = new TiktokenSplitter(tok, 800, 100);

      const embeddings = new CloudflareWorkersAIEmbeddings({ binding: env.AI, model: "@cf/baai/bge-m3" });
      const vectorstore = new CloudflareVectorizeStore({ index: env.VEC, embeddings });
      const retriever = vectorstore.asRetriever(4);

      const model = new ChatCloudflareWorkersAI({ binding: env.AI, model: "@cf/meta/llama-3.1-8b-instruct" });

      const chain = RunnableSequence.from([
        async (input: { question: string }) => ({ question: input.question }),
        async ({ question }) => {
          const docs = await retriever.getRelevantDocuments(question);
          return { question, context: docs.map(d => d.pageContent).join("\n---\n") };
        },
        async ({ question, context }) =>
          model.invoke([
            { role: 'system', content: 'Answer based only on the context.' },
            { role: 'user', content: `Q: ${question}\n\nContext:\n${context}` },
          ]),
      ]);

      const answer = await chain.invoke({ question: q });
      return new Response(JSON.stringify({ answer }), { headers: { "content-type": "application/json" } });
    }
    return new Response("ok");
  }
};
