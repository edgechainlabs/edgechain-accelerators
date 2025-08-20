export interface TokenizerPort {
  readonly name: string;
  encode(text: string): Promise<Uint32Array | number[]>;
  count(text: string): Promise<number>;
  free?(): void | Promise<void>;
}
