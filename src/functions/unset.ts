import { Primative, Definition, Index } from '..';

export function unset<T extends Primative>(target: T[], payload: T): T[];
export function unset<T>(target: T, key: string, definition: Definition<T>): T;
export function unset<T>(target: Index<T>, key: string): Index<T>;
export function unset<T>(a, b, c?): T | T[] | Index<T> {
  if (Array.isArray(a)) {
    return unsetFromPrimativeArray(a, b);
  }
  if (c) {
    return unsetFromObject(a, b, c);
  }

  return unsetFromIndex(a, b);
}

function unsetFromPrimativeArray<T extends Primative>(
  target: T[],
  payload: T,
): T[] {
  throw new Error('method not implemented');
}

function unsetFromObject<T>(
  target: T,
  key: string,
  definition: Definition<T>,
): T {
  throw new Error('method not implemented');
}

function unsetFromIndex<T>(target: Index<T>, key: string): Index<T> {
  throw new Error('method not implemented');
}
