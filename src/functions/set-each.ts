import { Primitive, Index, Definition } from '..';

export function setEach<T extends Primitive>(target: T[], payload: T): T[];

export function setEach<T>(
  target: Index<T>,
  payload: T[],
  definition: Definition<T>,
): Index<T>;

export function setEach<T>(
  target: Index<T>,
  payload: Index<T>,
  definition: Definition<T>,
): Index<T>;

export function setEach<T>(a, b, c?): T[] | Index<T> {
  if (Array.isArray(a)) {
    return setInPrimitiveArray(a, b);
  }
  if (Array.isArray(b)) {
    return setFromArray(a, b, c);
  }
  return setFromIndex(a, b, c);
}

function setInPrimitiveArray<T extends Primitive>(
  target: T[],
  payload: T,
): T[] {
  throw new Error('method not implemented');
}

function setFromArray<T>(
  target: Index<T>,
  payload: T[],
  definition: Definition<T>,
): T {
  throw new Error('method not implemented');
}

function setFromIndex<T>(
  target: Index<T>,
  payload: Index<T>,
  definition: Definition<T>,
): Index<T> {
  throw new Error('method not implemented');
}
