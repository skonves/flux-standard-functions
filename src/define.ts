import { Definition, Rule } from '.';

export function define<T>(props: { [K in keyof T]: Rule }): Definition<T> {
  throw new Error('method not implemented');
}
