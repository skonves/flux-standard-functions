# Helpers

This package provides a few convenience function for converting data between Indexes and Arrays.

To use these functions:

```js
import { index, deindex } from 'flux-standard-functions';
```

## index(values, definition)

Pameters:

* `values <Array>` - An array of objects.
* `definition <Object>` - An object that defines the objects in the array. The Defintion must specifies which property should be used as the key of the index.

Converts an array of objects to an Index whose key is defined by the supplied `definiton` object.

Example:

```js
const definition = define({
  id: key(), // <= Specifies that the "id" property should be used as the Index key
  name: required(),
});

const values = [
  { id: 'abc', name: 'John Doe' },
  { id: 'def', name: 'Jane Porter' },
  { id: 'jkl', name: 'Eric Tile' },
];

const result = index(values, definition);
/* output =>
  {
    { abc: { id: 'abc', name: 'John Doe' }},
    { def: { id: 'def', name: 'Jane Porter' }},
    { jkl: { id: 'jkl', name: 'Eric Tile' }},
  }
*/
```

## deindex(values)

Pameters:

* `values <Object>` - An Index of objects.

Converts an Index to an Array of objects.

Example:

```js
const values = {
    { abc: { id: 'abc', name: 'John Doe' }},
    { def: { id: 'def', name: 'Jane Porter' }},
    { jkl: { id: 'jkl', name: 'Eric Tile' }},
  };

const result = index(values, definition);
/* output =>
  [
    { id: 'abc', name: 'John Doe' },
    { id: 'def', name: 'Jane Porter' },
    { id: 'jkl', name: 'Eric Tile' },
  ]
*/
```
