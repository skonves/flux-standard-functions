# Define

The define function is used to create definitions for the objects that on contained in the Redux store. The Standard Functions use these definitions for validation, indexing, and optimization.

To use these functions:

```js
import { define } from 'flux-standard-functions';
```

## define(rules)

Parameters:

* `rules <Object>` - An object that respresents the properties and property rules for a given type.

Creates a Definition object that describes a type. These definitions are required arguments for most of the Standard Functions.

Here is an example of defining a "User" object:

```js
const userDefinition = define({
  id: key(),
  name: required(),
  email: optional(),
  createdOn: immutable(),
});
```

Any operation that adds a property not included in the definition will be ignored without throwing an error. Properties are ignored independently. This means that, per the above definition, if the `email` and `address` properties were patched, then `address` would be ignored, but `email` would still be updated.
