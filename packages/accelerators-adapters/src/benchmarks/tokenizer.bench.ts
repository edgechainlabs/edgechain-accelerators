import { bench, describe, beforeAll, test, expect } from 'vitest';  
import { createTokenizer } from '../tokenizers/factory';  
import type { TokenizerPort } from '@edgechain/accelerators-core';  
  
describe('WASM vs JavaScript 토크나이저 벤치마크', () => {  
  let wasmTokenizer: TokenizerPort;  
  let jsTokenizer: TokenizerPort;  
    
  const testTexts = {  
    short: "짧은 텍스트 샘플",  
    medium: "이것은 중간 길이의 텍스트입니다. ".repeat(10) + "성능 테스트를 위한 샘플 텍스트입니다.",  
    long: "긴 텍스트 샘플입니다. ".repeat(100) + "WASM과 JavaScript 구현 간의 성능 차이를 측정합니다.",  
    xlarge: "A".repeat(10000) // 10KB 텍스트  
  };  

  // 토크나이저 초기화를 beforeAll에서 처리하여 초기화 오버헤드 제거
  beforeAll(async () => {
    wasmTokenizer = await createTokenizer({ useWasm: 'always' });
    jsTokenizer = await createTokenizer({ useWasm: 'never' });
  });
  
  describe('encode() 메서드 벤치마크', () => {  
    describe('짧은 텍스트', async () => {
      bench('WASM - 짧은 텍스트', async () => {  
        await wasmTokenizer.encode(testTexts.short,);  
      });  
  
      bench('JS - 짧은 텍스트', async () => {  
        await jsTokenizer.encode(testTexts.short);  
      });
    });

    describe('중간 텍스트', () => {
      bench('WASM - 중간 텍스트', async () => {  
        await wasmTokenizer.encode(testTexts.medium);  
      });  
  
      bench('JS - 중간 텍스트', async () => {
        await jsTokenizer.encode(testTexts.medium);  
      });  
    })    

    describe('긴 텍스트', () => {
      bench('WASM - 긴 텍스트', async () => {  
        await wasmTokenizer.encode(testTexts.long);  
      });  

      bench('JS - 긴 텍스트', async () => {  
        await jsTokenizer.encode(testTexts.long);  
      });  
    })    

    describe('매우 긴 텍스트 (10KB)', () => {
      bench('WASM - 매우 긴 텍스트 (10KB)', async () => {  
        await wasmTokenizer.encode(testTexts.xlarge);  
      });  

      bench('JS - 매우 긴 텍스트 (10KB)', async () => {  
        await jsTokenizer.encode(testTexts.xlarge);  
      });   
    });
  });  
  
  describe('count() 메서드 벤치마크', () => {  
    describe('짧은 텍스트', () => {
      bench('WASM count - 짧은 텍스트', async () => {  
        await wasmTokenizer.count(testTexts.short);  
      });  
  
      bench('JS count - 짧은 텍스트', async () => {  
        await jsTokenizer.count(testTexts.short);  
      });  
    });
  
    describe('중간 텍스트', () => {
      bench('WASM count - 중간 텍스트', async () => {  
        await wasmTokenizer.count(testTexts.medium);  
      });  
  
      bench('JS count - 중간 텍스트', async () => {  
        await jsTokenizer.count(testTexts.medium);  
      });  
    });
  
    describe('긴 텍스트', () => {
      bench('WASM count - 긴 텍스트', async () => {  
        await wasmTokenizer.count(testTexts.long);  
      });  
  
      bench('JS count - 긴 텍스트', async () => {  
        await jsTokenizer.count(testTexts.long);  
      });  
    });
  
    describe('매우 긴 텍스트 (10KB)', () => {
      bench('WASM count - 매우 긴 텍스트 (10KB)', async () => {  
        await wasmTokenizer.count(testTexts.xlarge);  
      });  
  
      bench('JS count - 매우 긴 텍스트 (10KB)', async () => {  
        await jsTokenizer.count(testTexts.xlarge);  
      });  
    });
  });  
  
  describe('연속 호출 벤치마크 (워밍업 효과)', () => {  
    bench('WASM - 연속 encode 호출', async () => {  
      for (let i = 0; i < 5; i++) {  
        await wasmTokenizer.encode(testTexts.medium);  
      }  
    });  
  
    bench('JS - 연속 encode 호출', async () => {  
      for (let i = 0; i < 5; i++) {  
        await jsTokenizer.encode(testTexts.medium);  
      }  
    });  
  });  

  // 성능 비교를 위한 별도 테스트
  describe('성능 비교 테스트', () => {
    test('encode() 성능 비교 - 짧은 텍스트', async () => {
      const iterations = 100;
      
      // WASM 성능 측정
      const wasmStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await wasmTokenizer.encode(testTexts.short);
      }
      const wasmTime = performance.now() - wasmStart;
      
      // JS 성능 측정
      const jsStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await jsTokenizer.encode(testTexts.short);
      }
      const jsTime = performance.now() - jsStart;
      
      console.log(`\n=== 짧은 텍스트 encode() 성능 비교 ===`);
      console.log(`WASM: ${wasmTime.toFixed(2)}ms (${(wasmTime / iterations).toFixed(4)}ms/op)`);
      console.log(`JS: ${jsTime.toFixed(2)}ms (${(jsTime / iterations).toFixed(4)}ms/op)`);
      console.log(`WASM is ${(jsTime / wasmTime).toFixed(2)}x faster than JS`);
      
      // 성능 차이가 있다면 WASM이 더 빠를 것으로 예상
      expect(wasmTime).toBeLessThan(jsTime * 2); // WASM이 JS보다 2배 이상 느리지 않아야 함
    });

    test('encode() 성능 비교 - 중간 텍스트', async () => {
      const iterations = 50;
      
      // WASM 성능 측정
      const wasmStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await wasmTokenizer.encode(testTexts.medium);
      }
      const wasmTime = performance.now() - wasmStart;
      
      // JS 성능 측정
      const jsStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await jsTokenizer.encode(testTexts.medium);
      }
      const jsTime = performance.now() - jsStart;
      
      console.log(`\n=== 중간 텍스트 encode() 성능 비교 ===`);
      console.log(`WASM: ${wasmTime.toFixed(2)}ms (${(wasmTime / iterations).toFixed(4)}ms/op)`);
      console.log(`JS: ${jsTime.toFixed(2)}ms (${(jsTime / iterations).toFixed(4)}ms/op)`);
      console.log(`WASM is ${(jsTime / wasmTime).toFixed(2)}x faster than JS`);
      
      expect(wasmTime).toBeLessThan(jsTime * 2);
    });

    test('count() 성능 비교 - 짧은 텍스트', async () => {
      const iterations = 100;
      
      // WASM 성능 측정
      const wasmStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await wasmTokenizer.count(testTexts.short);
      }
      const wasmTime = performance.now() - wasmStart;
      
      // JS 성능 측정
      const jsStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await jsTokenizer.count(testTexts.short);
      }
      const jsTime = performance.now() - jsStart;
      
      console.log(`\n=== 짧은 텍스트 count() 성능 비교 ===`);
      console.log(`WASM: ${wasmTime.toFixed(2)}ms (${(wasmTime / iterations).toFixed(4)}ms/op)`);
      console.log(`JS: ${jsTime.toFixed(2)}ms (${(jsTime / iterations).toFixed(4)}ms/op)`);
      console.log(`WASM is ${(jsTime / wasmTime).toFixed(2)}x faster than JS`);
      
      expect(wasmTime).toBeLessThan(jsTime * 2);
    });
  });
});