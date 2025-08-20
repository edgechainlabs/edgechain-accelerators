export type WasmPolicy = 'auto' | 'always' | 'never';

export interface AccelOptions {
  useWasm?: WasmPolicy;
  minBytesForWasm?: number;
}
