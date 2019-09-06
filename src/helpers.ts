import { Definition, Index } from '.';
import { WideWeakMap } from './wide-weak-map';

/**
 * Converts an array of objects to an Index whose key is defined by the
 * supplied `definiton` object.
 * @param values An array of objects.
 * @param definition An object that defines the objects in the array.
 * The Defintion must specifies which property should be used as the key
 * of the index.
 * @returns An Index object.
 */
export function index<T>(values: T[], definition: Definition<T>): Index<T> {
  if (!indexMap.has(values, definition)) {
    const result = {};
    const length = values.length;
    for (let i = 0; i < length; i++) {
      const v = values[i];
      result[definition.getKey(v)] = v;
    }

    indexMap.set([values, definition], result);
  }

  return indexMap.get(values, definition) as any;
}
const indexMap = new WideWeakMap();

/**
 * Returns all of the values of an Index as an array objects.
 * @param values An index of objects
 */
export function deindex<T>(values: Index<T>): T[] {
  if (!deindexMap.has(values)) {
    const keys = Object.keys(values);
    const length = keys.length;
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = values[keys[i]];
    }

    deindexMap.set(values, result);
  }

  return deindexMap.get(values);
}
const deindexMap = new WeakMap();
