import { Primitive, Definition, Index, Patch } from '..';
import { patch } from './patch';

export function set<T extends Primitive>(target: T[], payload: T): T[];
export function set<T>(
  target: T,
  key: keyof T,
  payload: any,
  definition: Definition<T>,
): T;
export function set<T>(
  target: Index<T>,
  payload: T,
  definition: Definition<T>,
): Index<T>;
export function set<T>(a, b, c?, d?): T | T[] | Index<T> {
  if (Array.isArray(a)) {
    return setInPrimitiveArray(a, b);
  }
  if (d) {
    return setOnObject(a, b, c, d);
  }
  return setInIndex(a, b, c);
}

function setInPrimitiveArray<T extends Primitive>(
  target: T[],
  payload: T,
): T[] {
  const originalSet = new Set(target);

  return originalSet.has(payload)
    ? target
    : Array.from(originalSet.add(payload));
}

function setOnObject<T>(
  target: T,
  key: keyof T,
  payload: any,
  definition: Definition<T>,
): T {
  return patch(target, { [key]: payload } as Patch<T>, definition);
}

function setInIndex<T>(
  target: Index<T>,
  payload: T,
  definition: Definition<T>,
): Index<T> {
  if (!payload) return target;

  const validItem = definition.getPayload(payload);
  if (!validItem) return target;

  const key = definition.getKey(payload);
  if (!key) return target;

  return { ...target, [key]: validItem };
}
