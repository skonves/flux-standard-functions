import { Primitive, Definition, Index, patch } from '..';
import { DELETE_VALUE, Patch } from '../types';

export function unset<T extends Primitive>(target: T[], payload: T): T[];
export function unset<T>(target: T, key: keyof T, definition: Definition<T>): T;
export function unset<T>(target: Index<T>, key: string | number): Index<T>;
export function unset<T>(a, b, c?): T | T[] | Index<T> {
  if (Array.isArray(a)) {
    return unsetFromPrimitiveArray(a, b);
  }
  if (c) {
    return unsetFromObject(a, b, c);
  }

  return unsetFromIndex(a, b);
}

function unsetFromPrimitiveArray<T extends Primitive>(
  target: T[],
  payload: T,
): T[] {
  const set = new Set(target);
  return set.delete(payload) ? Array.from(set) : target;
}

function unsetFromObject<T>(
  target: T,
  key: keyof T,
  definition: Definition<T>,
): T {
  if (typeof target[key] === 'undefined') return target;

  return patch(target, { [key]: DELETE_VALUE } as Patch<T>, definition);
}

function unsetFromIndex<T>(target: Index<T>, key: string): Index<T> {
  if (!target[key]) return target;

  const { [key]: removed, ...rest } = target;

  return rest;
}
