# Set Each

Set Each provides the ability to either add or overwrite data to multiple items at once.

To use this function:

```js
import { setEach } from 'flux-standard-functions';
```

## setEach(target, payload)

Parameters:

* `target <Array>` - Array of primitive values.
* `payload <Array>` - The Array of new primitive values to add.

Adds new values to a primitive array (strings, numbers, booleans, or Symbols). If any of the `payload` values did not already exist in the `target` the a new Array is returned; otherwise, the original `target` is returned by reference. The resulting array will not contain any duplicate values.

Example:

```js
function setFavoriteNumber(state, action) {
  const target = state.favoriteNumbers; // [ 4, 8, 15, 16 ]
  const payload = action.payload; // [ 16, 23, 42 ]

  const updatedFavoriteNumbers = setEach(target, payload); // => [ 4, 8, 15, 16, 23, 42 ]

  return {
    ...state,
    favoriteNumbers: updatedFavoriteNumbers,
  };
}
```

## setEach(target, payload, definition)

Parameters:

* `target <Index>` - The Index to update.
* `payload <Array | Index>` - An Array or Index of objects to add to the `target` Index. If the `payload` is an Array, then the property of the object that is defined as the `key()` is used to determine the Index key. If the `payload` is an Index, then the keys of the `payload` object are matched to the keys of the `target` object.
* `definition <Object>` - Defines the properties of the `target` object. The definition must contain a `key()` property.

Adds or replaces multiple objects within the `target` Index. If the object in the `target` Index was added or replaced, then an updated shallow clone of the `target` Index is returned. If nothing changed (eg. all of the objects in the `payload` array were invalid per the `definition`) then the original `target` is returned by reference.

Example of a reducer that adds or overwrite from an Array:

```js
function setEachUser(state, action) {
  const target = state.users;
  /*
    {
      { def: { id: 'def', name: 'Jane Porter', email: 'jane.porter@example.com' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */
  const payload = action.payload;
  /*
    [
      { id: 'abc', name: 'John Doe' },
      { id: 'def', name: 'Jane Clayton' },
    ]
  */

  const updatedUsers = setEach(target, payload, userDefinition);
  /*
    {
      { abc: { id: 'abc', name: 'John Doe' }},
      { def: { id: 'def', name: 'Jane Clayton' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */

  return {
    ...state,
    users: updatedUsers,
  };
}
```

Example of a reducer that adds or overwrite from an Index:

```js
function setEachUser(state, action) {
  const target = state.users;
  /*
    {
      { def: { id: 'def', name: 'Jane Porter', email: 'jane.porter@example.com' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */
  const payload = action.payload;
  /*
    {
      { abc: { id: 'abc', name: 'John Doe' }},
      { def: { id: 'def', name: 'Jane Clayton' }},
    }
  */

  const updatedUsers = setEach(target, payload, userDefinition);
  /*
    {
      { abc: { id: 'abc', name: 'John Doe' }},
      { def: { id: 'def', name: 'Jane Clayton' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */

  return {
    ...state,
    users: updatedUsers,
  };
}
```
