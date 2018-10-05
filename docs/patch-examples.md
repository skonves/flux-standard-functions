### When patching with primitive properties

#### Adding a new primitive value

When a new property is supplied in the `payload` that is defined as `optional()`, it is added to the result:

```js
const definition = define({
  id: key(),
  name: required(),
  email: optional(),
});

const target = { id: 7, name: 'John Doe' };
const payload = { email: 'john.doe@example.com' };

const result = patch(target, payload, definition);
// => { id: 7, name: 'John Doe', email: 'john.doe@example.com' }
```

The result is created as a shallow clone of the `target` (unless no change has been made) so it can safely be used when returning a new state.

Note that if a property is supplied by the `payload` but is not defined in the `definition`, then it is ignored by the `patch()` function. If no properties are added (or updated), then the original `target` is returned by reference.

#### Overwriting an existing primitive value

When a primitive property is supplied in the `payload` that already exists on the `target` (but is not defined as a key or immutable), then it is updated in the `result`:

```js
const definition = define({
  id: key(),
  name: required(),
  email: optional(),
});

const target = { id: 7, name: 'John Doe' };
const payload = { name: 'Jane Doe' };

const result = patch(target, payload, definition);
// => { id: 7, name: 'Jane Doe' }
```

The result is created as a shallow clone of the `target` (unless no change has been made) so it can safely be used when returning a new state.

Note that if a property exists on the `target` and the `payload` but is defined as a `key()` or `immutable()`, then it is ignored by the `patch()` function. If no properties are updated (or added), then the original `target` is returned by reference.

#### Deleting a primitive value

If the `payload` contains a property with whose value is the `DELETE_VALUE` symbol, then the property will be removed on the `result`.

```js
import { DELETE_VALUE } from 'flux-standard-functions';

const definition = define({
  id: key(),
  name: required(),
  email: optional(),
});

const target = { id: 7, name: 'John Doe', email: 'john.doe@example.com' };
const payload = { email: DELETE_VALUE };

const result = patch(target, payload, definition);
// => { id: 7, name: 'John Doe' }
```

The result is created as a shallow clone of the `target` (unless no change has been made) so it can safely be used when returning a new state.

Note that if the property did not already exist on the `target` or is not defined as `optional()`, then it is ignored by the `patch()` function. If no properties are deleted (or otherwise changed), then the original `target` is returned by reference.

### When patching with a complex value

#### Adding a new complex value

If the `payload` contains a complex property that does not yet exist on the `target`, then the value will be added (as long as it is valid).

```js
const definition = define({
  id: key(),
  name: required(),
  address: define({
    zip: required(),
    line1: required(),
    line2: optional(),
  });
});

const target = { id: 7, name: 'John Doe' };
const payload = { address: { zip: 98765, line1: '123 Main St.' } };

const result = patch(target, payload, definition);
// => { id: 7, name: 'John Doe', address: { zip: 98765, line1: '123 Main St.' } }
```

The result is created as a shallow clone of the `target` (unless no change has been made) so it can safely be used when returning a new state.

Note that child properties of the supplied complex value will be ignored if they are not present in the definition. The entire complex property will also be ignored if it is not valid per the definition and not already present on the `target`.

If a complex property is supplied by the `payload` but is not defined in the `definition`, then it is ignored by the `patch()` function. If no properties are added (or updated), then the original `target` is returned by reference.

#### Patching an existing complex value

If the `payload` contains a complex property that already exists on the `target`, then the existing property will be patched.

```js
const definition = define({
  id: key(),
  name: required(),
  address: define({
    zip: required(),
    line1: required(),
    line2: optional(),
  });
});

const target = { id: 7, name: 'John Doe', address: { zip: 98765, line1: '123 Main St.' } };
const payload = { address: { line1: '456 Third St.' } };

const result = patch(target, payload, definition);
// => { id: 7, name: 'John Doe', address: { zip: 98765, line1: '456 Third St.' } }
```

Patching complex child properties works just like patching the child property as the `target` of the `patch()` function. This means that you can deeply nest multiple layers of complex values and use `DELETE_VALUE` to remove deeply nested properties. (Please note that while this library does support deep, complex state structure, the Redux docs generally recommend flat state.)

The result is created as a shallow clone of the `target` (unless no change has been made) so it can safely be used when returning a new state.

If a complex property is supplied by the `payload` but is not defined in the `definition`, then it is ignored by the `patch()` function. If no properties are added (or updated), then the original `target` is returned by reference.

#### Deleting a complex value

Deleting a complex value works exactly like deleting a primitive value:

```js
import { DELETE_VALUE } from 'flux-standard-functions';

const definition = define({
  id: key(),
  name: required(),
  address: define({
    zip: required(),
    line1: required(),
    line2: optional(),
  });
});

const target = { id: 7, name: 'John Doe', address: { zip: 98765, line1: '123 Main St.' } };
const payload = { address: DELETE_VALUE };

const result = patch(target, payload, definition);
// => { id: 7, name: 'John Doe' }
```

The result is created as a shallow clone of the `target` (unless no change has been made) so it can safely be used when returning a new state.

Note that if the property did not already exist on the `target` or is not defined as `optional()`, then it is ignored by the `patch()` function. If no properties are deleted (or otherwise changed), then the original `target` is returned by reference.

### When patching with Index values

In this library, an "Index" is an object that meets two basic conditions. First, its values are objects whose definitions have a property defined as a `key()`. Secondly, the values of the keys on the "Index" object are equal to the `key()` properties on its child values. See the docs for more info on using "Index" objects.

TODO

### When patching with primitive array values

TODO
