[![travis](https://img.shields.io/travis/skonves/flux-standard-functions.svg)](https://travis-ci.org/skonves/flux-standard-functions)
[![coveralls](https://img.shields.io/coveralls/skonves/flux-standard-functions.svg)](https://coveralls.io/github/skonves/flux-standard-functions)
[![npm](https://img.shields.io/npm/v/flux-standard-functions.svg)](https://www.npmjs.com/package/flux-standard-functions)

# Flux Standard Functions

Build simple, predictable reducers in Redux

## Motivation

One of the best features of Redux is its lack of features. Actions may be structured in any way imaginable so long as they contain a `type` property. Reducing functions must only return a new state from the original state and an action. With minimal opinions, Redux is very flexible.

But ultimate flexibility can often be a barrier to productivity. Jason Kurian (@JaKXz) introduced a "human-friendly standard for Flux action objects" which he calls "[Flux Standard Actions](https://github.com/redux-utilities/flux-standard-action)" (or FSAs) to help mitigate this effect. He observed that "It's much easier to work with Flux actions if we can make certain assumptions about their shape." The opinions introduced by FSAs help the developer reason about the shape of actions, but there has still been a lack of similar opinions for reducers.

This library introduces "Flux Standard Functions" (or FSFs) that aim provide a similar standard for designing reducing functions. By removing some of Redux’s ultimate flexibility, FSFs allow developers to build (and understand) simple, predictable reducers.

## Design goals

* **Simple** - There are only three CRUD functions that mutate data.
* **Comprehensive** - This package shouldn't limit what developers can build.
* **Productive** - Maximize productivity by minimizing repeated code.
* **Backwards compatible** - FSFs are just as awesome with "brown field" projects.

## Example

Here is an example of a reducer built with Flux Standard Functions:

```js
function patchEachUser(state, action) {
  const existingUsers = state.users;
  const userUpdates = action.payload;

  const updatedUsers = patchEach(existingUsers, userUpdates, userDefinition);

  return {
    ...state,
    users: updatedUsers,
  };
}
```

This reducer needs to update existing data, so we use the "Patch" function. Because we want to update multiple users at once, we use the batch varient which is `patchEach`.

## The Three Functions

The Standard Functions typically work with a combination of three parameters: `target`, `payload`, and `definition`. The `target` is the data that is being "mutated". (Note: that if the `target` is changed, then a shallow clone is created.) The `payload` is the new data that is being added, updated, replaced, or removed. The `definition` is an object that describes the structure of the `target` object and is used for validation, indexing, and optimization.

### Set

Set provides the ability to either add or overwrite data. This is analogous to the "Create" CRUD operation. If a value being set already exists, then it will be overwritten. If the value being set does not exist then it is added. Any operations that set a value not inclued in the `definition` or that are defined as immutable will be ignored.

Use [`set`](/src/functions/set.md) for single values and [`setEach`](/src/functions/set-each.md) for batch set operations.

### Patch

Patch provides the ability to update (or "upsert") data. This is similar the the "Update" CRUD operation. If a value being patched already exists, then it will be replaced. For complex properties, it will be partially updated with the properties in the `payload`. If the property did not already exist and is valid per the `definition` then it will be added.

Use [`patch`](/src/functions/patch.md) for single patches and [`patchEach`](/src/functions/patch-each.md) for batch patch operations.

### Unset

Unset provides the ability to remove data. This is analogous to the "Delete" CRUD operation. If the valued being unset exists, then it is removed. If the value being unset does not exist or is specified by the `definition` to be required or immutable, then nothing happens.

Use [`unset`](/src/functions/unset.md) to remove single values and [`unsetEach`](/src/functions/unset-each.md) for batch unset operations.

## Definitions and Rules

The Standard Functions use the `definition` parameter to validate changes. The [`define()`](/src/define.md) function is used to create the defintion for types:

Here is an example of defining a "User" object:

```js
const userDefinition = define({
  id: key(),
  name: required(),
  email: optional(),
  createdOn: immutable(),
});
```

See the documentation on [Rules](/src/rules.md) for the various rules that can be used to create definitions.

## Indexes

The Redux docs contain a fantastic article on [Normalizing State Shape](https://redux.js.org/recipes/structuringreducers/normalizingstateshape). The section on Designing a Normalized State gives a few basic concepts for data normalization which include:

* Each type of data gets its own "table" in the state.
* Each "data table" should store the individual items in an object, with the IDs of the items as keys and the items themselves as the values.
* Any references to individual items should be done by storing the item's ID.

This package heavily depends the concept of "tables" with the structure referred to as "Indexes". Indexes are just plain Javascript objects with the IDs of the items as keys and the items themselves as the values. The "key" properties speficied using the `define` function.

An "Index" of users might look like this:

```js
const userDefinition = define({
  id: key(),
  name: requried(),
  email: optional(),
});

const userIndex = {
  abc: {
    id: 'abd',
    name: 'John Doe',
    email: 'jd@example.com',
  },
  def: {
    id: 'def',
    name: 'Jane Porter',
  },
  jkl: {
    id: 'jkl',
    name: 'Eric Tile',
  },
};
```

This package also provide a few helper functions to easily convert data between Indexes and Arrays. See the documentation on [Helpers](/src/helpers.md) for more information.

## Prior Art

### Redux Data Normaization

The principles of Data Normalization frequently cited within this project heavily influenced its development. Like is recommended, Flux Standard Functions work well with a "flat" or normalized state.

### Underscore/Lodash

The `_.set` and `_.merge` functions map roughly to the `set` and `patch` Standard Functions. There are a number of examples to be found online of using Underscore or Lodash for building reducers.

### Normalizr

"Normalizr is a small, but powerful utility for taking JSON with a schema definition and returning nested entities with their IDs, gathered in dictionaries."
