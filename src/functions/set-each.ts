import { Primitive, Index, Definition } from '..';

export function setEach<T extends Primitive>(target: T[], payload: T[]): T[];

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
  payload: T[],
): T[] {
  const set = new Set(target);

  let added = false;

  for (const value of payload) {
    if (!set.has(value)) {
      set.add(value);
      added = true;
    }
  }

  return added ? Array.from(set) : target;
}

function setFromArray<T>(
  target: Index<T>,
  payload: T[],
  definition: Definition<T>,
): Index<T> {
  return payload.reduce((acc, item) => {
    const key = definition.getKey(item);
    if (!key) return acc;

    const validItem = definition.getPayload(item);
    if (!validItem) return acc;

    return { ...acc, [key]: validItem };
  }, target);
}

function setFromIndex<T>(
  target: Index<T>,
  payload: Index<T>,
  definition: Definition<T>,
): Index<T> {
  if (!payload) return target;

  const keys = Object.keys(payload);

  return keys.reduce((acc, key) => {
    const validItem = definition.getPayload(payload[key]);
    if (!validItem) return acc;

    const keyFromDefinition = definition.getKey(validItem);
    if (key !== keyFromDefinition) return acc;

    return { ...acc, [key]: validItem };
  }, target);
}
