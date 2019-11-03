import { Index, Primitive } from '..';

export function unsetEach<T extends Primitive>(target: T[], payload: T[]): T[];
export function unsetEach<T>(
  target: Index<T>,
  keys: (string | number)[],
): Index<T>;
export function unsetEach<T>(a, b): T[] | Index<T> {
  if (Array.isArray(a)) {
    return unsetFromPrimitiveArray(a, b);
  }
  return unsetFromIndex(a, b);
}

function unsetFromPrimitiveArray<T extends Primitive>(
  target: T[],
  payload: T[],
): T[] {
  if (typeof payload === 'undefined' || payload === null) return target;

  const set = new Set(target);

  let removed = false;

  for (const item of payload) {
    removed = set.delete(item) || removed;
  }

  return removed ? Array.from(set) : target;
}

function unsetFromIndex<T>(
  target: Index<T>,
  keys: (string | number)[],
): Index<T> {
  const originalKeys = Object.keys(target);

  const set = new Set(keys);

  const finalKeys = originalKeys.filter(key => !set.has(key));

  if (finalKeys.length === originalKeys.length) return target;

  return finalKeys.reduce((acc, key) => ({ ...acc, [key]: target[key] }), {});
}
