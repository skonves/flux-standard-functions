import { Primitive, Definition, Index, Patch } from '..';
import { patch } from './patch';

/**
 * Adds a new value to a primitive array (strings, numbers, booleans, or Symbols).
 * @param target An array of primitive values.
 * @param payload A primitive value to add to the array.
 * @returns If the `payload` did not already exist in the `target` the a new
 * Array is returned; otherwise, the original `target` is returned by reference.
 */
export function set<T extends Primitive>(target: T[], payload: T): T[];

/**
 * Adds or replaces an object within the `target` Index.
 * @param target The Index to update.
 * @param payload The object to add or replace. The property of the object that
 * is defined as the `key()` is used to determine the Index key.
 * @param definition Defines the properties of the `payload` object. The
 * definition must contain a `key()` property.
 * @returns If the object in the `target` Index was added or replaced, then an
 * updated shallow clone of the `target` object is returned. If nothing changed
 * (eg. the `payload` was invalid per the `definition`) then the original `target`
 * is returned by reference.
 */
export function set<T>(
  target: Index<T>,
  payload: T,
  definition: Definition<T>,
): Index<T>;

/**
 * Adds or replaces a property on the `target` object.
 * @param target The object to update.
 * @param key The property on the `target` object that will be set.
 * @param payload The new value of the property.
 * @param definition Defines the properties of the `target` object so that immutable
 * and extraneous properties are not set.
 * @returns If the value of the updated property changed, then an updated shallow
 * clone of the `target` object is returned. If the value did not change (eg. the
 * property is not included in the `definition` or is defined as `immutable()`),
 * then the original `target` is returned by reference.
 */
export function set<T>(
  target: T,
  key: keyof T,
  payload: any,
  definition: Definition<T>,
): T;

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
  const childDefinition = definition.getDefinitions(key);

  if (childDefinition && childDefinition.object) {
    const childPayload = childDefinition.object.getPayload(payload);
    return typeof childPayload === 'undefined' || childPayload === null
      ? target
      : { ...(target as any), [key]: childPayload };
  } else if (childDefinition && childDefinition.index) {
    const childKeys = Object.keys(payload);

    let hasSet = false;

    const childResult = childKeys.reduce((acc, childKey) => {
      const childPayload = childDefinition.index.getPayload(payload[childKey]);

      if (typeof childPayload === 'undefined' || childPayload === null) {
        return acc;
      }

      hasSet = true;
      return { ...acc, [childKey]: childPayload };
    }, {});

    return hasSet ? { ...(target as any), [key]: childResult } : target;
  } else if (childDefinition && childDefinition.isArray) {
    const x = definition.getPatch({ [key]: payload } as Patch<T>);
    return x && x[key] ? { ...(target as any), [key]: x[key] } : target;
  } else {
    return patch(target, { [key]: payload } as Patch<T>, definition);
  }
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
