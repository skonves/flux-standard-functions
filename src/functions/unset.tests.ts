import { expect } from 'chai';

import {
  DELETE_VALUE,
  Index,
  define,
  key as keyRule,
  optional,
  required,
  objectOf,
  indexOf,
  array,
  unset,
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
      expect(result).to.equal(target);
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

      const expected: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };

      // ACT
      const result = unset(target, key, parentDef);

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

      const expected: TestItem = { ...target };

      // ACT
      const result = unset(target, key, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops if getPatch returns falsy', () => {
      // ARRANGE
      const target: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };
      const key = 'id';

      const expected: TestItem = { ...target };

      // ACT
      const result = unset(target, key, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
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
      expect(result).to.equal(target);
    });
  });
});
