import { Primative, Definition, Index } from '..';

export function set<T extends Primative>(target: T[], payload: T): T[];
export function set<T>(
  target: T,
  key: string,
  payload: Primative,
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

function setInPrimitiveArray<T extends Primative>(
  target: T[],
  payload: T,
): T[] {
  throw new Error('method not implemented');
}

function setOnObject<T>(
  target: T,
  key: string,
  payload: Primative,
  definition: Definition<T>,
): T {
  throw new Error('method not implemented');
}

function setInIndex<T>(
  target: Index<T>,
  payload: T,
  definition: Definition<T>,
): Index<T> {
  throw new Error('method not implemented');
}
