export type Primative = Symbol | string | number | boolean;
export interface Definition<T> {
  getPayload(payload: T): T;
  getPatch(payload: T): Patch<T>;
  getKey(payload: T): string;
}
export type Index<T> = { [key: string]: T };
export type Patch<T> = { [K in keyof T]?: any };
export type Rule = any;
