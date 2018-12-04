import { expect } from 'chai';

import {
  Index,
  define,
  key as keyRule,
  optional,
  required,
  objectOf,
  indexOf,
  array,
  setEach,
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

describe('setEach', () => {
  describe('primitive array', () => {
    it('Adds new values', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = [4, 5];

      // ACT
      const result = setEach(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3, 4, 5]);
    });

    it('No-ops when adding existing values', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = [2, 3];

      // ACT
      const result = setEach(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
      expect(result).to.equal(target);
    });
  });

  describe('from array', () => {
    it('Adds new items', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
      };
      const payload: TestItem[] = [
        {
          id: 'b',
          name: 'name of b',
        },
      ];

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('Overwrites existing items', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: TestItem[] = [
        {
          id: 'a',
          name: 'new name of a',
        },
      ];

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'new name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when key is not included', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: any[] = [
        {
          name: 'new name of a',
          value: 18,
        },
      ];

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when payload item is invalid', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: any[] = [
        {
          id: 'a',
          value: 18,
        },
      ];

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });
  });

  describe('from object', () => {
    it('Adds new items', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
          value: 7,
        },
      };
      const payload: Index<TestItem> = {
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('Overwrites existing items', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'new name of a',
        },
      };

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'new name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when key is not included', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: Index<TestItem> = {
        a: {
          name: 'new name of a',
          value: 18,
        } as TestItem,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when item key does not match payload key', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: Index<TestItem> = {
        a: {
          id: 'not the same as the payload key',
          name: 'new name of a',
          value: 18,
        },
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when payload item is invalid', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'original name of a',
          value: 7,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: Index<TestItem> = {
        a: {
          id: 'a',
          value: 18,
        } as TestItem,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });
  });
});
