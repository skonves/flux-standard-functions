import { Definition, Index, Patch } from '..';

export function patch<T>(
  target: T,
  payload: Patch<T>,
  definition: Definition<T>,
): T;
export function patch<T>(
  target: Index<T>,
  key: string,
  payload: Patch<T>,
  definition: Definition<T>,
): Index<T>;
export function patch<T>(a, b, c?, d?): T | Index<T> {
  if (d) {
    return patchIndex(a, b, c, d);
  }

  return patchObject(a, b, c);
}

function patchObject<T>(
  target: T,
  payload: Patch<T>,
  definition: Definition<T>,
): T {
  throw new Error('method not implemented');
}

function patchIndex<T>(
  target: Index<T>,
  key: string,
  payload: Patch<T>,
  definition: Definition<T>,
): T {
  throw new Error('method not implemented');
}
