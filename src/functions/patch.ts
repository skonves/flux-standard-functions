import { Definition, Index, Patch } from '..';
import { DELETE_VALUE } from '../types';

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
  const patchValue = definition.getPatch(payload);

  if (!patchValue) return target;

  const x = { ...(target as any), ...(patchValue as any) };

  return Object.keys(x)
    .filter(key => x[key] !== DELETE_VALUE)
    .reduce(
      (acc, key) => ({
        ...(acc as any),
        [key]: x[key],
      }),
      {},
    );
}

function patchIndex<T>(
  target: Index<T>,
  key: string,
  payload: Patch<T>,
  definition: Definition<T>,
): Index<T> {
  const item = target[key];

  if (!item) return target;

  const patchedItem = patch(item, payload, definition);

  if (item === patchedItem) return target;

  return { ...target, [key]: patchedItem };
}
