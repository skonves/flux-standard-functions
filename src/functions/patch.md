# Patch

Patch provides the ability to either partially update existing data or add new data.

To use this function:

```js
import { patch } from 'flux-standard-functions';
```

## patch(target, payload, definition)

Parameters:

* `target <Object>` - The object to be patched.
* `payload <Object>` - An object that contains the patch data. Properties and sub-properties must be included in the supplied `definition` and any of its sub-definitions. Patch properties not included in the `definition` will be ignored. Values may be removed from the object in the `target` index by using the `DELETE_VALUE` symbol.
* `definition <Object>` - Defines the properties of the `target` being patched so that immutable properties are not updated, required properties are not removed, and extraneous properties are not added.

Adds, updates, or deletes properties on the `target` object using values from the `payload`. If `target` is patched, then an updated shallow clone of `target` is returned; otherwise, `target` is returned by reference.

The following is an example of a reducer that uses the `patch` function to patch the a "user" object from state.

```js
function patchUser(state, action) {
  const target = state.user; // { id: 'abc', name: 'John Doe' }
  const payload = action.payload; // { email: 'john.doe@example.com' }

  const updatedUser = patch(target, payload, userDefinition);
  // => { id: 'abc', name: 'John Doe', email: 'john.doe@example.com' }

  return {
    ...state,
    user: updatedUser,
  };
}
```

## patch(target, key, payload, definition)

Parameters:

* `target <Object>` - The Index to be patched.
* `key string|number` - The key of the object within the Index.
* `payload <Object>` - An object that contains the patch data. Properties and sub-properties must be included in the supplied `definition` and any of its sub-definitions. Patch properties not included in the `definition` will be ignored. Values may be removed from the object in the `target` Index by using the `DELETE_VALUE` symbol.
* `definition <Object>` - Defines the properties of the object in the `target` index being patched so that immutable properties are not updated, required properties are not removed, and extraneous properties are not added.

Adds, updates, or deletes properties on an object in the `target` Index using values from the `payload`. If `target` is patched, then an updated shallow clone of `target` is returned; otherwise, `target` is returned by reference.

The following is an example of a reducer that uses the `patch` function to patch an Index containing user data.

```js
function patchUsers(state, action) {
  const target = state.users;
  /*
    { abc: { id: 'abc', name: 'John Doe' }},
    { def: { id: 'def', name: 'Jane Porter' }}
  */
  const key = action.payload.key; // 'abc'
  const payload = action.payload.data; // { email: 'john.doe@example.com' }

  const updatedUsers = patch(target, key, payload, userDefinition);
  /*
    { abc: { id: 'abc', name: 'John Doe', email: 'john.doe@example.com' }},
    { def: { id: 'def', name: 'Jane Porter' }}
  */

  return {
    ...state,
    users: updatedUsers,
  };
}
```
