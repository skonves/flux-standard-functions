# Set

Set provides the ability to either add or overwrite data.

To use this function:

```js
import { set } from 'flux-standard-functions';
```

## set(target, payload)

Parameters:

* `target <Array>` - Array of primitive values (strings, numbers, booleans, or Symbols)
* `payload <string | number | boolean | Symbol>` - The primitive value to add.

Adds a new value to a primitive array (strings, numbers, booleans, or Symbols). If the `payload` did not already exist in the `target` the a new Array is returned; otherwise, the original `target` is returned by reference.

Example:

```js
function setFavoriteNumber(state, action) {
  const target = state.favoriteNumbers; // [ 4, 8, 15, 16, 23 ]
  const payload = action.payload; // 42

  const updatedFavoriteNumbers = set(target, payload); // => [ 4, 8, 15, 16, 23, 42 ]

  return {
    ...state,
    favoriteNumbers: updatedFavoriteNumbers,
  };
}
```

## set(target, payload, definition)

Parameters:

* `target <Object>` - The Index to update
* `payload <Object>` - The object to add or replace. The property of the object that is defined as the `key()` is used to determine the Index key.
* `definition <Object>` - Defines the properties of the `payload` object. The definition must contain a `key()` property.

Adds or replaces an object within the `target` Index. If the object in the `target` Index was added or replaced, then an updated shallow clone of the `target` object is returned. If nothing changed (eg. the `payload` was invalid per the `definition`) then the original `target` is returned by reference.

Example of a reducer that uses `set` to overwrite a user:

```js
function setUser(state, action) {
  const target = state.users;
  /*
    {
      { abc: { id: 'abc', name: 'John Doe', email: 'john.doe@example.com' }},
      { def: { id: 'def', name: 'Jane Porter', email: 'jane.porter@example.com' }},
      { def: { id: 'jkl', name: 'Eric Tile' }},
    }
  */
  const payload = action.payload; // { id: 'def', name: 'Jane Clayton` }

  const updatedUsers = set(target, payload, userDefinition);
  /*
    {
      { abc: { id: 'abc', name: 'John Doe', email: 'john.doe@example.com' }},
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

## set(target, key, payload, definition)

Parameters:

* `target <Object>` - The object to update.
* `key <string | number>` - The property on the `target` object that will be set.
* `payload <Object>` - The new value of the property.
* `definition <Object>` - Defines the properties of the `target` object so that immutable and extraneous properties are not set.

Adds or replaces a property on the `target` object. If the value of the updated property changed, then an updated shallow clone of the `target` object is returned. If the value did not change (eg. the property was not included in the `definition` or is defined as `immutable()`), then the original `target` is returned by reference.

Example of a reducer that uses `set` to add or overwrite a user's email:

```js
function setUserEmail(state, action) {
  const target = state.user; // { id: 'abc', name: 'John Doe' }
  const key = 'email';
  const payload = action.payload; // 'john.doe@example.com'

  const updatedUser = set(target, key, payload, userDefinition);
  // => { id: 'abc', name: 'John Doe', email: 'john.doe@example.com' }

  return {
    ...state,
    user: updatedUser,
  };
}
```
