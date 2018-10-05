# Patch Each

Patch Each provides the ability to either partially update existing data or add new data to multiple items within an index.

To use this function:

```js
import { patchEach } from 'flux-standard-functions';
```

## patchEach(target, payload, definition)

Parameters:

* `target <Object>` - The Index to be patched.
* `payload <Array | Object>` - An array or Index of objects that contain the patch data. If the `payload` is an array, then the object in the `target` object that is patched is determined by the key of the object in the `payload` array. If the `payload` is an Index, then the objects in the `target` object that are patched are determined by the keys within in the `payload` Index. Properties and sub-properties must be included in the supplied `definition` and any of its sub-definitions. Patch properties not included in the `definition` will be ignored. Values may be removed from the objects in the `target` Index by using the `DELETE_VALUE` symbol.
* `definition <Object>` - Defines the properties of the object in the `target` index being patched so that immutable properties are not updated, required properties are not removed, and extraneous properties are not added.

Patches the objects in the `target` Index with each of the objects from the `payload` array. Note that each of the objects in the supplied `payload` array will be applied to the `target` Index similar to the `patch(target, key, payload, definition)` function. If `target` is patched, then an updated shallow clone of `target` is returned; otherwise, `target` is returned by reference.

Example of patching with an Array:

```js
function patchEachUser(state, action) {
  const target = state.users;
  /*
    {
      { abc: { id: 'abc', name: 'John Doe' }},
      { def: { id: 'def', name: 'Jane Porter' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */
  const payload = action.payload;
  /*
    [
      { id: 'abc', email: 'john.doe@example.com' },
      { id: 'def', email: 'jane.porter@example.com' },
    ]
  */

  const updatedUsers = patchEach(target, payload, userDefinition);
  /*
    {
      { abc: { id: 'abc', name: 'John Doe', email: 'john.doe@example.com' }},
      { def: { id: 'def', name: 'Jane Porter', email: 'jane.porter@example.com' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */

  return {
    ...state,
    users: updatedUsers,
  };
}
```

Example of patching with an Index:

```js
function patchEachUser(state, action) {
  const target = state.users;
  /*
    {
      { abc: { id: 'abc', name: 'John Doe' }},
      { def: { id: 'def', name: 'Jane Porter' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */
  const payload = action.payload;
  /*
    {
      { abc: { email: 'john.doe@example.com' }},
      { def: { email: 'jane.porter@example.com' }},
    }
  */

  const updatedUsers = patchEach(target, payload, userDefinition);
  /*
    {
      { abc: { id: 'abc', name: 'John Doe', email: 'john.doe@example.com' }},
      { def: { id: 'def', name: 'Jane Porter', email: 'jane.porter@example.com' }},
      { jkl: { id: 'jkl', name: 'Eric Tile' }},
    }
  */

  return {
    ...state,
    users: updatedUsers,
  };
}
```
