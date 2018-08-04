export type Primitive = Symbol | string | number | boolean;
export interface Definition<T> {
  getPayload(payload: Patch<T>): T;
  getPatch(payload: Patch<T>): Patch<T>;
  getKey(payload: Patch<T>): string;
  getDefinitions(
    key: keyof T,
  ): {
    index?: Definition<any>;
    object?: Definition<any>;
    isArray?: boolean;
  };
}
export type Index<T> = { [key: string]: T } | { [key: number]: T };
export type Patch<T> = { [K in keyof T]?: any };
export type Rule<T = any> = {
  isKey: boolean;
  isRequired?: boolean;
  isReadonly?: boolean;
  index?: Definition<T>;
  object?: Definition<T>;
  isArray?: boolean;
};

export const DELETE_VALUE = Symbol('DELETE_VALUE');
