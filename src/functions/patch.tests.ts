import { expect } from 'chai';

import { patch } from './patch';
import { Definition, Patch, DELETE_VALUE, Index } from '..';

type TestItem = {
  id: string;
  name: string;
  value?: number;
  child?: TestChildItem;
  children?: Index<TestChildItem>;
  items?: number[];
};

type TestChildItem = {
  id: string;
  name: string;
  value?: number;
};

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ value: x.value }),
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ value: x.value }),
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 18,
        };

        // ACT
        const result = patch(target, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when patch is falsy', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };
        const payload: Patch<TestItem> = {
          id: DELETE_VALUE,
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => null,
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ value: x.value }),
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => x,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'child name' },
        };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => ({ name: payload.child.name }),
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'new child name' },
        };

        // ACT
        const result = patch(target, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when getPayload returns falsy for new object', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          child: { id: 'child_id' },
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when getPatch returns falsy for existing object', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child_id', name: 'child name' },
        };
        const payload: Patch<TestItem> = {
          child: { id: 'new child ID' },
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => x,
              getPatch: x => null,
              getKey: x => x.id,
              getDefinitions: key => ({}),
            },
          }),
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
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => x,
              getPatch: x => x,
              getKey: x => x.id,
              getDefinitions: key => ({}),
            },
          }),
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
        const result = patch(target, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when getPayload returns falsy for new object', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const payload: Patch<TestItem> = {
          children: { a: { id: 'child_id' } },
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when getPatch returns falsy for existing object', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { id: 'child_id', name: 'child name' },
        };
        const payload: Patch<TestItem> = {
          children: { a: { id: 'new child ID' } },
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => x.id,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => x.id,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7, 18],
        };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
        };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7, 18],
        };

        // ACT
        const result = patch(target, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when getPatch returns falsy', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [7],
        };
        const payload: Patch<TestItem> = {
          items: ['asdf'],
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => null,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
        };

        const expected: TestItem = { ...target };

        // ACT
        const result = patch(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: x.value }),
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };

      // ACT
      const result = patch(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: x.value }),
        getKey: x => x.id,
        getDefinitions: key => null,
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
      const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ value: x.value }),
          getKey: x => x.id,
          getDefinitions: key => null,
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
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ value: x.value }),
          getKey: x => x.id,
          getDefinitions: key => null,
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
        const result = patch(target, key, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when patch is falsy', () => {
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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => null,
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => null,
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ child: x.child }),
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => x,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
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
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ child: x.child }),
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
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
        const result = patch(target, key, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when getPayload returns falsy for new object', () => {
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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ child: x.child }),
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when getPatch returns falsy for existing object', () => {
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
          child: { id: 'new child id' },
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ child: x.child }),
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ child: x.child }),
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => ({ child: x.child }),
          getKey: x => x.id,
          getDefinitions: key => ({
            object: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => x,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
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
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
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
        const result = patch(target, key, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when getPayload returns falsy for new object', () => {
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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when getPatch returns falsy for existing object', () => {
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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => null,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({
            index: {
              getPayload: x => null,
              getPatch: x => x,
              getKey: x => null,
              getDefinitions: key => ({}),
            },
          }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
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
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
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
        const result = patch(target, key, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when getPatch returns falsy', () => {
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
          items: '4,5',
        };
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => null,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

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
        const definition: Definition<TestItem> = {
          getPayload: x => null,
          getPatch: x => x,
          getKey: x => x.id,
          getDefinitions: key => ({ isArray: true }),
        };

        const expected: Index<TestItem> = { ...target };

        // ACT
        const result = patch(target, key, payload, definition);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });
  });
});
