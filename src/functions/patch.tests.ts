import { expect } from 'chai';

import {
  array,
  define,
  DELETE_VALUE,
  key as keyRule,
  Index,
  indexOf,
  objectOf,
  optional,
  patch,
  Patch,
  required,
} from '..';

type TestChildItem = {
  id: string;
  name: string;
  value?: number;
};

const childDef = define<TestChildItem>({
  id: keyRule(),
  name: required(),
  value: optional(),
});

type TestItem = {
  id: string;
  name: string;
  value?: number;
  child?: TestChildItem;
  children?: Index<TestChildItem>;
  items?: number[];
};

const parentDef = define<TestItem>({
  id: keyRule(),
  name: required(),
  value: optional(),
  child: optional(objectOf(childDef)),
  children: optional(indexOf(childDef)),
  items: optional(array()),
});

describe('patch', () => {
  describe('target object', () => {
    describe('with primitive property value', () => {
      it('Adds a new value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          value: 7,
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Overwrites an existing value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };
        const payload: Patch<TestItem> = {
          value: 18,
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 18,
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when value cannot be deleted', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };
        const payload: Patch<TestItem> = {
          id: DELETE_VALUE,
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not updated', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };
        const payload: Patch<TestItem> = {
          value: 7,
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not deleted', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          value: DELETE_VALUE,
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with object property value', () => {
      it('Adds a new object', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          child: { id: 'child_id', name: 'child name' },
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'child name' },
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Patches an existing object', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'child name' },
        };
        const payload: Patch<TestItem> = {
          child: { id: 'new id', name: 'new child name' },
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'new child name' },
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when new object is invalied', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload = {
          child: { id: 'child_id' },
        } as Patch<TestItem>;

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when patch only updates immutable child properties', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'child name' },
        };
        const payload: Patch<TestItem> = {
          child: { id: 'new child ID' },
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not updated', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'child name' },
        };
        const payload: Patch<TestItem> = {
          child: { name: 'child name' },
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not deleted', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'child name' },
        };
        const payload: Patch<TestItem> = {
          child: { value: DELETE_VALUE },
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with index property value', () => {
      it('Adds a new index', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          children: {
            a: { id: 'a', name: 'child a' },
            b: { id: 'b', name: 'child b' },
          },
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: {
            a: { id: 'a', name: 'child a' },
            b: { id: 'b', name: 'child b' },
          },
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Patches an existing index', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: {
            a: { id: 'a', name: 'child a' },
            b: { id: 'b', name: 'child b' },
          },
        };
        const payload: Patch<TestItem> = {
          children: {
            a: { name: 'new child a name' },
          },
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: {
            a: { id: 'a', name: 'new child a name' },
            b: { id: 'b', name: 'child b' },
          },
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when new index is invalid', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          children: { a: { id: 'child_id' } },
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when new index updates an immutable child value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { id: 'child_id', name: 'child name' },
        };
        const payload: Patch<TestItem> = {
          children: { a: { id: 'new child ID' } },
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not updated', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'child_id', name: 'child name' } },
        };
        const payload: Patch<TestItem> = {
          children: { a: { name: 'child name' } },
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not deleted', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'child_id', name: 'child name' } },
        };
        const payload: Patch<TestItem> = {
          children: { a: { value: DELETE_VALUE } },
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with primitive array property', () => {
      it('Adds a new array', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          items: [7, 18],
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7, 18],
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Patches an existing array', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7],
        };
        const payload: Patch<TestItem> = {
          items: [18],
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7, 18],
        };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when new array is falsy', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7],
        };
        const payload: Patch<TestItem> = {
          items: null,
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when array is not updated', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7, 18],
        };
        const payload: Patch<TestItem> = {
          items: [18],
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    it('Deletes an existing value', () => {
      // ARRANGE
      const target: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
        value: 7,
      };
      const payload: Patch<TestItem> = {
        value: DELETE_VALUE,
      };

      const expected: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };

      // ACT
      const result = patch(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });

  describe('object in target index', () => {
    it('Deletes an existing value', () => {
      // ARRANGE
      const key = 'QWERTY';

      const target: Index<TestItem> = {
        [key]: {
          id: key,
          name: 'asdf',
          value: 7,
        },
        'not-the-key': {
          id: 'not-the-key',
          name: 'asdf',
        },
      };
      const payload: Patch<TestItem> = {
        value: DELETE_VALUE,
      };

      const expected: Index<TestItem> = {
        [key]: {
          id: key,
          name: 'asdf',
        },
        'not-the-key': {
          id: 'not-the-key',
          name: 'asdf',
        },
      };

      // ACT
      const result = patch(target, key, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    describe('with primitive property value', () => {
      it('Adds a new value', () => {
        // ARRANGE

        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          value: 7,
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            value: 7,
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Overwrites an existing value', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            value: 7,
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          value: 18,
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            value: 18,
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when patch is invalid', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            value: 7,
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          id: 'THE NEW ID',
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not updated', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          name: 'asdf',
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not deleted', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        const payload: Patch<TestItem> = {
          value: DELETE_VALUE,
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with object property value', () => {
      it('Adds a new object', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          child: { id: 'child-id', name: 'child-name' },
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            child: { id: 'child-id', name: 'child-name' },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Patches an existing object', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            child: { id: 'child-id', name: 'child-name' },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          child: { name: 'new child name' },
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            child: { id: 'child-id', name: 'new child name' },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when value updates an immutable property', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          child: { id: 'child-id' },
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not updated', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            child: { id: 'child-id', name: 'child-name', value: 7 },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          child: { value: 7 },
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not deleted', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            child: { id: 'child-id', name: 'child-name' },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          child: { value: DELETE_VALUE },
        };
        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with index property value', () => {
      it('Adds a new index', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          children: {
            a: { id: 'a', name: 'child-value-a' },
            b: { id: 'b', name: 'child-value-b' },
          },
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            children: {
              a: { id: 'a', name: 'child-value-a' },
              b: { id: 'b', name: 'child-value-b' },
            },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Patches an existing object', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            children: {
              a: { id: 'a', name: 'child-value-a' },
              b: { id: 'b', name: 'child-value-b' },
            },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          children: {
            b: { name: 'new child-value-b' },
          },
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            children: {
              a: { id: 'a', name: 'child-value-a' },
              b: { id: 'b', name: 'new child-value-b' },
            },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when index values are invalid', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          children: {
            a: { id: 'a' },
            b: { id: 'b' },
          },
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when new index value updates an immutable value', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            children: {
              a: { id: 'a', name: 'child-value-a' },
              b: { id: 'b', name: 'child-value-b' },
            },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          children: {
            b: { id: 'new id' },
          },
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not updated', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            children: {
              a: { id: 'a', name: 'child-value-a' },
              b: { id: 'b', name: 'child-value-b' },
            },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          children: {
            b: { name: 'child-value-b' },
          },
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when value is not deleted', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            children: {
              a: { id: 'a', name: 'child-value-a' },
              b: { id: 'b', name: 'child-value-b' },
            },
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          children: {
            b: { value: DELETE_VALUE },
          },
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with primitive array property', () => {
      it('Adds a new array', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          items: [1, 2, 3],
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            items: [1, 2, 3],
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Patches an existing array', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            items: [1, 2, 3],
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          items: [4, 5],
        };

        const expected: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            items: [1, 2, 3, 4, 5],
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when payload is not an array', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            items: [1, 2, 3],
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload = ({
          items: '4,5',
        } as any) as Patch<TestItem>;

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when array is not updated', () => {
        // ARRANGE
        const key = 'QWERTY';

        const target: Index<TestItem> = {
          [key]: {
            id: key,
            name: 'asdf',
            items: [1, 2, 3],
          },
          'not-the-key': {
            id: 'not-the-key',
            name: 'asdf',
          },
        };
        const payload: Patch<TestItem> = {
          items: [2, 3],
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });
  });
});
