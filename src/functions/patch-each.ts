import { Definition, Index, Patch } from '..';
import { patch } from './patch';

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
  if (!payload.length) return target;

  return payload.reduce((acc, item) => {
    const key = definition.getKey(item);
    if (!key) return acc;

    const existingItem = target[key];
    if (!existingItem) return acc;

    const patchedItem = patch(existingItem, item, definition);
    if (patchedItem === existingItem) return acc;

    return { ...(acc as any), [key]: patchedItem };
  }, target);
}

function patchEachFromMap<T>(
  target: Index<T>,
  payload: { [key: string]: Patch<T> },
  definition: Definition<T>,
): Index<T> {
  if (!payload) return target;

  const keys = Object.keys(payload);
  if (!keys) return target;

  return keys.reduce((acc, key) => {
    const existingItem = target[key];
    if (!existingItem) return acc;

    const patchedItem = patch(existingItem, payload[key], definition);
    if (patchedItem === existingItem) return acc;

    return { ...(acc as any), [key]: patchedItem };
  }, target);
}
