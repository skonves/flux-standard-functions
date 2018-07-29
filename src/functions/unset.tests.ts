import { expect } from 'chai';

import { Definition, unset, Index } from '..';
import { DELETE_VALUE } from '../types';

type TestItem = {
  id: string;
  name: string;
  value?: number;
};

describe('unset', () => {
  describe('primitive array', () => {
    it('Removes an existing value', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = 3;

      // ACT
      const result = unset(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2]);
    });

    it('No-ops when value did not exist', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = 4;

      // ACT
      const result = unset(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
    });
  });

  describe('object', () => {
    it('Removes an existing value', () => {
      // ARRANGE
      const target: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
        value: 7,
      };
      const key = 'value';
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ [key]: DELETE_VALUE }),
        getKey: x => x.id,
      };

      const expected: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };

      // ACT
      const result = unset(target, key, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops if value is not found', () => {
      // ARRANGE
      const target: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };
      const key = 'value';
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ [key]: DELETE_VALUE }),
        getKey: x => null,
      };

      const expected: TestItem = { ...target };

      // ACT
      const result = unset(target, key, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops if getPatch returns falsy', () => {
      // ARRANGE
      const target: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };
      const key = 'id';
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => null,
      };

      const expected: TestItem = { ...target };

      // ACT
      const result = unset(target, key, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });

  describe('index', () => {
    it('Removes an existing item', () => {
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

      const expected: Index<TestItem> = {
        'not-the-key': {
          id: 'not-the-key',
          name: 'asdf',
        },
      };

      // ACT
      const result = unset(target, key);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when the key does not match an item', () => {
      // ARRANGE
      const key = 'NOT FOUND';

      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'asdf',
        },
        b: {
          id: 'b',
          name: 'asdf',
        },
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = unset(target, key);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });
});
