# Rules

These rules define how object properties behave while being Patched, Set, and Unset.

To use these rules:

```js
import {
  key,
  immutable,
  required,
  optional,
  indexOf,
  objectOf,
  array,
} from 'flux-standard-functions';
```

## key()

This rule indicates that the property is to be used as the "key" within an Index. A definition is not required to include a key, but any definition with a key may only include one. A property defined as a key is also required and immutable. The `key()` rule may not be combined with `optional()`.

## immutable()

This rule indicates that a property value may not be changed once it is added. Immutable properties are required by default, but can be explicitly specified to be optional. Any operations to update an immutable property will be ignored without throwing an error. To include a property that may be initially `undefined` but then immutable once added, use `optional(immutable())`.

## required()

This rule indicates that a property value must be included. Required properties may be updated, but may not be removed. Any operations to remove an required property will be ignored without throwing an error. The `required()` rule may not be combined with `optional()`.

## optional()

This rule indicates that a property value may must be included. Required properties may be updated, but may not be removed. Any operations to remove an required property will be ignored without throwing an error.

## objectOf(definition)

Parameters:

* `definition <Object>` - A definiton object that describes a complex property.

This rule is used to define complex properties.

```js
const userDefinition = define({
  id: key(),
  name: required(),
  address: objectOf(
    define({
      line1: required(),
      line2: optional(),
      city: required(),
      state: required(),
      postalCode: required(),
    }),
  ),
});
```

Properties defined with this rule are optional by default. This rule can be combined with `immutable()` and `required()`. (Combining with `option()` is technically allowed, but has no effect.)

Note: An immutable complex property may not be removed or replaced, but its own properties are not automatically immutable. This is similar to the behavior of a `const` in ES6: constants may not be changed, but their properties may be added, edited, or removed.

Warning: While this package does support complex properties, it is generally a good practice to keep your Redux store fairely flat. The Redux docs contain a great article about [normalizing state shape](https://redux.js.org/recipes/structuringreducers/normalizingstateshape). This rule may make it easy to work with a deeply nested state; however, it doesn't make doing so correct. Consider only using complex properties sparingly.

## indexOf(definition)

Parameters:

* `definition <Object>` - A definiton object that describes the objects within the Index property.

This rule is similar to `objectOf` but instead declares an Index of the defined property.

```js
const userDefinition = define({
  id: key(),
  name: required(),
  widgets: indexOf(
    define({
      id: key(),
      color: required(),
    }),
  ),
});
```

Properties defined with this rule are optional by default. This rule can be combined with `immutable()` and `required()`. (Combining with `option()` is technically allowed, but has no effect.)

Note: An immutable Index property may not be removed or replaced, but the objects it contains may be added, updated, or removed. This is similar to the behavior of a `const` in ES6: constants may not be changed, but their properties may be added, edited, or removed.

Warning: While this package does support Index properties, it is generally a good practice to keep your Redux store fairely flat. The Redux docs contain a great article about [normalizing state shape](https://redux.js.org/recipes/structuringreducers/normalizingstateshape). This rule may make it easy to work with a deeply nested state; however, it doesn't make doing so correct. Consider only using Index properties sparingly. Instead, consider using an `array()` property to store references to objects in another "table" within the Redux store.

## array()

The rule is used to defined primitive array properties. Note that this package does not support Arrays that contain objects. A primitive array may only contain `string`, `number`, `boolean`, or `Symbol` values.
