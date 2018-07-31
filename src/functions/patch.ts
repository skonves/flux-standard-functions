import { Definition, Index, Patch } from '..';
import { DELETE_VALUE, Primitive } from '../types';
import { patchEach } from './patch-each';
import { setEach } from './set-each';

export function patch<T>(
  target: T,
  payload: Patch<T>,
  definition: Definition<T>,
): T;
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
          const childPatch = patchValue[key];

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
          const childPatch = patchValue[key];

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
          const childPatch = patchValue[key];

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
            patchValue[key],
          );

          if (childObject) {
            result[key] = childObject;
            patched = true;
          }
        }
      } else if (childDefinitions && childDefinitions.isArray) {
        if (hasExistingValue) {
          const originalValue = result[key] as any;
          const childPatch = patchValue[key];

          const newValue = setEach(originalValue, childPatch) as any;

          if (newValue !== originalValue) {
            result[key] = newValue;
            patched = true;
          }
        } else {
          result[key] = patchValue[key];
          patched = true;
        }
      } else {
        result[key] = patchValue[key];
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
