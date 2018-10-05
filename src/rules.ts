import { Rule } from '.';
import { Definition, Primitive } from './types';

/**
 * Indicates that the property is to be used as the "key" within an Index.
 * A definition is not required to include a key, but any definition with
 * a key may only include one. A property defined as a key is also required
 * and immutable. The `key()` rule may not be combined with `optional()`.
 */
export function key(): Rule {
  return { isKey: true, isReadonly: true, isRequired: true };
}

/**
 * Indicates that a property value may not be changed once it is added.
 * Immutable properties are required by default, but can be explicitly
 * specified to be optional. Any operations to update an immutable property
 * will be ignored without throwing an error. To include a property that
 * may be initially `undefined` but then immutable once added, use
 * `optional(immutable())`.
 */
export function immutable(rule?: Rule): Rule {
  return {
    isKey: rule ? rule.isKey : false,
    isReadonly: true,
    isRequired: rule ? rule.isRequired : true,
    isArray: rule ? rule.isArray : undefined,
    index: rule ? rule.index : undefined,
    object: rule ? rule.object : undefined,
  };
}

/**
 * Indicates that a property value must be included. Required properties may
 * be updated, but may not be removed. Any operations to remove an required
 * property will be ignored without throwing an error. The `required()` rule
 * may not be combined with `optional()`.
 */
export function required(rule?: Rule): Rule {
  return {
    isKey: rule ? rule.isKey : false,
    isReadonly: rule ? rule.isReadonly : undefined,
    isRequired: true,
    isArray: rule ? rule.isArray : undefined,
    index: rule ? rule.index : undefined,
    object: rule ? rule.object : undefined,
  };
}

/**
 * Indicates that a property value may must be included. Required properties may
 * be updated, but may not be removed. Any operations to remove an required
 * property will be ignored without throwing an error. An immutable complex property
 * may not be removed or replaced, but its own properties are not automatically
 * immutable. This is similar to the behavior of a `const` in ES6: constants may
 * not be changed, but their properties may be added, edited, or removed.
 */
export function optional(rule?: Rule): Rule {
  return {
    isKey: rule ? rule.isKey : false,
    isReadonly: rule ? rule.isReadonly : undefined,
    isRequired: false,
    isArray: rule ? rule.isArray : undefined,
    index: rule ? rule.index : undefined,
    object: rule ? rule.object : undefined,
  };
}
/**
 * Defines an Index property. Properties defined with this rule are optional by
 * default. This rule can be combined with `immutable()` and `required()`.
 * (Combining with `option()` is technically allowed, but has no effect.) An
 * immutable Index property may not be removed or replaced, but the objects
 * it contains may be added, updated, or removed. This is similar to the behavior
 * of a `const` in ES6: constants may not be changed, but their properties may be
 * added, edited, or removed.
 */
export function indexOf<T>(definition: Definition<T>): Rule<T> {
  return { isKey: false, index: definition };
}

/**
 * Defines a complex property. Properties defined with this rule are optional by
 * default. This rule can be combined with `immutable()` and `required()`.
 * (Combining with `option()` is technically allowed, but has no effect.)
 */
export function objectOf<T>(definition: Definition<T>): Rule<T> {
  return { isKey: false, object: definition };
}

/**
 * Defines a primitive array property.  Note that this package does not support
 * defining Arrays that contain objects. A primitive array may only contain `string`,
 * `number`, `boolean`, or `Symbol` values.
 */
export function array(): Rule {
  return { isKey: false, isArray: true };
}
