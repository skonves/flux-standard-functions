import { Definition, Index, Patch } from '..';
import { DELETE_VALUE, Primitive } from '../types';
import { patchEach } from './patch-each';
import { setEach } from './set-each';

/**
 * Adds, updates, or deletes properties on the `target` object using values
 * from the `payload`.
 * @param target The object to be patched.
 * @param payload An object that contains the patch data. Properties and
 * sub-properties must be included in the supplied `definition` and any of its
 * sub-definitions.  Patch properties not included in the `definition` will
 * be ignored. Values may be removed from the `target` object by using the
 * `DELETE_VALUE` symbol.
 * @param definition Defines the properties of the `target` being patched so
 * that immutable properties are not updated, required properties are not
 * removed, and extraneous properties are not added.
 * @returns If `target` is patched, then an updated shallow clone of `target`
 * is returned; otherwise, `target` is returned by reference.
 */
export function patch<T>(
  target: T,
  payload: Patch<T>,
  definition: Definition<T>,
): T;

/**
 * Adds, updates, or deletes properties on an object in the `target` Index using values
 * from the `payload`.
 * @param target The Index to be patched.
 * @param key The key of the object within the Index.
 * @param payload An object that contains the patch data. Properties and
 * sub-properties must be included in the supplied `definition` and any of its
 * sub-definitions.  Patch properties not included in the `definition` will
 * be ignored. Values may be removed from the object in the `target` index by
 * using the `DELETE_VALUE` symbol.
 * @param definition Defines the properties of the object in the `target` index
 * being patched so that immutable properties are not updated, required properties
 * are not removed, and extraneous properties are not added.
 * @returns If `target` is patched, then an updated shallow clone of `target`
 * is returned; otherwise, `target` is returned by reference.
 */
export function patch<T>(
  target: Index<T>,
  key: string | number,
  payload: Patch<T>,
  definition: Definition<T>,
): Index<T>;
export function patch<T>(a, b, c?, d?): T | Index<T> {
  if (d) {
    return patchIndex(a, b, c, d);
  }

  return patchObject(a, b, c);
}

function patchObject<T>(
  target: T,
  payload: Patch<T>,
  definition: Definition<T>,
): T {
  const patchValue = definition.getPatch(payload);

  if (!patchValue) return target;

  let patched = false;
  const result: T = { ...(target as any) };

  for (const key in patchValue) {
    const hasExistingValue = typeof result[key] !== 'undefined';
    if (
      target[key] === patchValue[key] ||
      (patchValue[key] === DELETE_VALUE && !hasExistingValue)
    ) {
      continue;
    }
    if (patchValue[key] === DELETE_VALUE && hasExistingValue) {
      delete result[key];
      patched = true;
    } else {
      const childDefinitions = definition.getDefinitions(key);

      if (childDefinitions && childDefinitions.index) {
        if (hasExistingValue) {
          const originalValue = result[key] as any;
          const childPatch = patchValue[key] as any;

          const newValue = patchEach(
            originalValue,
            childPatch,
            childDefinitions.index,
          );
          if (newValue !== originalValue) {
            result[key] = newValue as any;
            patched = true;
          }
        } else {
          const originalValue = {};
          const childPatch = patchValue[key] as any;

          const newValue = patchEach(
            originalValue,
            childPatch,
            childDefinitions.index,
          );

          if (newValue !== originalValue) {
            result[key] = newValue as any;
            patched = true;
          }
        }
      } else if (childDefinitions && childDefinitions.object) {
        if (hasExistingValue) {
          const originalValue = result[key];
          const childPatch = patchValue[key] as any;

          const newValue = patch(
            originalValue,
            childPatch,
            childDefinitions.object,
          );

          if (newValue !== originalValue) {
            result[key] = newValue;
            patched = true;
          }
        } else {
          const childObject = childDefinitions.object.getPayload(
            patchValue[key] as any,
          );

          if (childObject) {
            result[key] = childObject;
            patched = true;
          }
        }
      } else if (childDefinitions && childDefinitions.isArray) {
        if (hasExistingValue) {
          const originalValue = result[key] as any;
          const childPatch = patchValue[key] as any;

          const newValue = setEach(originalValue, childPatch) as any;

          if (newValue !== originalValue) {
            result[key] = newValue;
            patched = true;
          }
        } else {
          result[key] = patchValue[key] as any;
          patched = true;
        }
      } else {
        result[key] = patchValue[key] as any;
        patched = true;
      }
    }
  }

  return patched ? result : target;
}

function patchIndex<T>(
  target: Index<T>,
  key: string | number,
  payload: Patch<T>,
  definition: Definition<T>,
): Index<T> {
  const item = target[key];

  if (!item) return target;

  const patchedItem = patch(item, payload, definition);

  if (item === patchedItem) return target;

  return { ...target, [key]: patchedItem };
}
