import { Definition, Index, Patch } from '..';
import { patch } from './patch';

/**
 * Patches the objects in the `target` Index with each of the objects from the
 * `payload` array. Note that each of the objects in the supplied `payload` array
 * will be applied to the `target` Index similar to the `patch(target, key, payload,
 * definition)` function.
 * @param target The Index to be patched.
 * @param payload An array of objects that contain the patch data. The object in
 * the `target` object that is patched is determined by the key of the object
 * in the `payload` array. Properties and sub-properties must be included in the
 * supplied `definition` and any of its sub-definitions.  Patch properties not
 * included in the `definition` will be ignored. Values may be removed from the
 * objects in the `target` Index by using the `DELETE_VALUE` symbol.
 * @param definition Defines the properties of the object in the `target` index
 * being patched so that immutable properties are not updated, required properties
 * are not removed, and extraneous properties are not added.
 * @returns If `target` is patched, then an updated shallow clone of `target`
 * is returned; otherwise, `target` is returned by reference.
 */
export function patchEach<T>(
  target: Index<T>,
  payload: Patch<T>[],
  definition: Definition<T>,
): Index<T>;

/**
 * Patches the objects in the `target` Index with each of the objects from the
 * `payload` Index. Note that each of the objects in the supplied `payload` Index
 * will be applied to the `target` Index similar to the `patch(target, key, payload,
 * definition)` function.
 * @param target The Index to be patched.
 * @param payload An Index of objects that contain the patch data. The objects in
 * the `target` object that are patched are determined by the keys within
 * in the `payload` Index. Properties and sub-properties must be included in the
 * supplied `definition` and any of its sub-definitions.  Patch properties not
 * included in the `definition` will be ignored. Values may be removed from the
 * objects in the `target` Index by using the `DELETE_VALUE` symbol.
 * @param definition Defines the properties of the object in the `target` index
 * being patched so that immutable properties are not updated, required properties
 * are not removed, and extraneous properties are not added.
 * @returns If `target` is patched, then an updated shallow clone of `target`
 * is returned; otherwise, `target` is returned by reference.
 */
export function patchEach<T>(
  target: Index<T>,
  payload: Index<Patch<T>>,
  definition: Definition<T>,
): Index<T>;

export function patchEach<T>(a, b, c?): Index<T> {
  if (Array.isArray(b)) {
    return patchEachFromArray(a, b, c);
  }

  return patchEachFromIndex(a, b, c);
}

function patchEachFromArray<T>(
  target: Index<T>,
  payload: Patch<T>[],
  definition: Definition<T>,
): Index<T> {
  if (!payload.length) return target;

  const updates: Index<T> = {};

  for (const item of payload) {
    const key = definition.getKey(item);
    if (!key) continue;

    const existingItem = target[key];
    if (!existingItem) continue;

    const patchedItem = patch(existingItem, item, definition);
    if (patchedItem === existingItem) continue;

    updates[key] = patchedItem;
  }

  return Object.keys(updates).length
    ? Object.assign({}, target, updates)
    : target;
}

function patchEachFromIndex<T>(
  target: Index<T>,
  payload: Index<Patch<T>>,
  definition: Definition<T>,
): Index<T> {
  if (!payload) return target;

  const updates: Index<T> = {};

  for (const key in payload) {
    const existingItem = target[key];
    if (!existingItem) {
      const newItem = definition.getPayload(payload[key]);
      if (!newItem) continue;

      updates[key] = newItem;
      continue;
    }

    const patchedItem = patch(existingItem, payload[key], definition);
    if (patchedItem === existingItem) continue;

    updates[key] = patchedItem;
  }

  return Object.keys(updates).length
    ? Object.assign({}, target, updates)
    : target;
}
