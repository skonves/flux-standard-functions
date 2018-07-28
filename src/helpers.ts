import { Definition, Index } from '.';

export function index<T>(values: T[], definition: Definition<T>): Index<T> {
  throw new Error('method not implemented');
}

export function deindex<T>(values: Index<T>): T[] {
  throw new Error('method not implemented');
}
