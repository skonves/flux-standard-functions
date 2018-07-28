import { Definition, Index, Patch } from '..';

export function patchEach<T>(
  target: Index<T>,
  payload: Patch<T>[],
  definition: Definition<T>,
): Index<T>;
export function patchEach<T>(
  target: Index<T>,
  payload: { [key: string]: Patch<T> },
  definition: Definition<T>,
): Index<T>;
export function patchEach<T>(a, b, c?): Index<T> {
  if (Array.isArray(b)) {
    return patchEachFromArray(a, b, c);
  }

  return patchEachFromMap(a, b, c);
}

function patchEachFromArray<T>(
  target: Index<T>,
  payload: Patch<T>[],
  definition: Definition<T>,
): Index<T> {
  throw new Error('method not implemented');
}

function patchEachFromMap<T>(
  target: Index<T>,
  payload: { [key: string]: Patch<T> },
  definition: Definition<T>,
): Index<T> {
  throw new Error('method not implemented');
}
