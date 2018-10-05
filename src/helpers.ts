import { Definition, Index } from '.';

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
  return values.reduce(
    (acc, value) => ({ ...acc, [definition.getKey(value)]: value }),
    {},
  );
}

/**
 * Returns all of the values of an Index as an array objects.
 * @param values An index of objects
 */
export function deindex<T>(values: Index<T>): T[] {
  const keys = Object.keys(values);
  return keys.map(key => values[key]);
}
