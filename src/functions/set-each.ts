import { Primitive, Index, Definition } from '..';

/**
 * Adds new values to a primitive array (strings, numbers, booleans, or Symbols).
 * @param target An array of primitive values.
 * @param payload An array of new primitive value to add.
 * @returns If any of the `payload` did not alreay exist in the `target`
 * the a new Array is returned; otherwise, the original `target` is returned by reference.
 * The resulting array will not contain any duplicate values.
 */
export function setEach<T extends Primitive>(target: T[], payload: T[]): T[];

/**
 * Adds or replaces multiple objects within the `target` Index.
 * @param target The Index to update.
 * @param payload An Array of objects to add to the `target` Index. The property
 * of the object that is defined as the `key()` is used to determine the Index key.
 * @param definition Defines the properties of the `payload` object. The
 * definition must contain a `key()` property.
 * @returns If the object in the `target` Index was added or replaced, then an
 * updated shallow clone of the `target` Index is returned. If nothing changed
 * (eg. all of the objects in the `payload` array were invalid per the `definition`)
 * then the original `target` is returned by reference.
 */
export function setEach<T>(
  target: Index<T>,
  payload: T[],
  definition: Definition<T>,
): Index<T>;

/**
 * Adds or replaces multiple objects within the `target` Index.
 * @param target The Index to update.
 * @param payload An Index of objects to add to the `target` Index.  The keys of
 * the `payload` object are matched to the keys of the `target` object.
 * @param definition Defines the properties of the `payload` object. The
 * definition must contain a `key()` property.
 * @returns If the object in the `target` Index was added or replaced, then an
 * updated shallow clone of the `target` Index is returned. If nothing changed
 * (eg. all of the objects in the `payload` array were invalid per the `definition`)
 * then the original `target` is returned by reference.
 */
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
  if (typeof payload === 'undefined' || payload === null) return target;

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
  const updates: Index<T> = {};

  for (const item of payload) {
    const key = definition.getKey(item);
    if (!key) continue;

    const validItem = definition.getPayload(item);
    if (!validItem) continue;

    updates[key] = validItem;
  }

  return Object.keys(updates).length
    ? Object.assign({}, target, updates)
    : target;
}

function setFromIndex<T>(
  target: Index<T>,
  payload: Index<T>,
  definition: Definition<T>,
): Index<T> {
  if (!payload) return target;
  const updates: Index<T> = {};

  for (const key in payload) {
    const validItem = definition.getPayload(payload[key]);
    if (!validItem) continue;

    const keyFromDefinition = definition.getKey(validItem);
    if (key !== keyFromDefinition) continue;

    updates[key] = validItem;
  }

  return Object.keys(updates).length
    ? Object.assign({}, target, updates)
    : target;
}
