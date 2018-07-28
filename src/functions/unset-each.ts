import { Index, Primative } from '..';

export function unsetEach<T extends Primative>(target: T[], payload: T[]): T[];
export function unsetEach<T>(target: Index<T>, keys: string[]): Index<T>;
export function unsetEach<T>(a, b): T[] | Index<T> {
  if (Array.isArray(a)) {
    return unsetFromPrimativeArray(a, b);
  }
  return unsetFromIndex(a, b);
}

function unsetFromPrimativeArray<T extends Primative>(
  target: T[],
  payload: T[],
): T[] {
  throw new Error('method not implemented');
}

function unsetFromIndex<T>(target: Index<T>, keys: string[]): Index<T> {
  throw new Error('method not implemented');
}
