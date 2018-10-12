import { Definition, Index } from '.';

export function index<T>(values: T[], definition: Definition<T>): Index<T> {
  return values.reduce(
    (acc, value) => ({ ...acc, [definition.getKey(value)]: value }),
    {},
  );
}

export function deindex<T>(values: Index<T>): T[] {
  const keys = Object.keys(values);
  return keys.map(key => values[key]);
}
