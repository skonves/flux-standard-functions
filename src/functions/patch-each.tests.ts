import { expect } from 'chai';

import {
  Patch,
  DELETE_VALUE,
  Index,
  define,
  key,
  optional,
  required,
  objectOf,
  indexOf,
  array,
  patchEach,
} from '..';

type TestChildItem = {
  id: string;
  name: string;
  value?: number;
};

const childDef = define<TestChildItem>({
  id: key(),
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
  id: key(),
  name: required(),
  value: optional(),
  child: optional(objectOf(childDef)),
  children: optional(indexOf(childDef)),
  items: optional(array()),
});

describe('patch-each', () => {
  describe('from array', () => {
    it('Adds new values', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: Patch<TestItem>[] = [
        {
          id: 'a',
          value: 7,
        },
      ];

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
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('Overwrites existing values', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: Patch<TestItem>[] = [
        {
          id: 'a',
          value: 18,
        },
      ];

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
          value: 18,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('Deletes existing values', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: Patch<TestItem>[] = [
        {
          id: 'a',
          value: DELETE_VALUE,
        },
      ];

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when payload is undefined', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: Patch<TestItem>[] = undefined;

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when payload is null', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: Patch<TestItem>[] = null;

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when payload is an empty array', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: Patch<TestItem>[] = [];

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when all payload items are invalid', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: Patch<TestItem>[] = [
        {
          id: 'a',
        },
      ];

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when no value is changed', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: Patch<TestItem>[] = [
        {
          id: 'a',
          value: 7,
        },
      ];

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when no value is deleted', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: Patch<TestItem>[] = [
        {
          id: 'a',
          value: DELETE_VALUE,
        },
      ];

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });
  });

  describe('from index', () => {
    it('Adds new values', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: { [key: string]: Patch<TestItem> } = {
        a: { value: 7 },
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
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('Overwrites existing values', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: { [key: string]: Patch<TestItem> } = {
        a: { value: 18 },
      };

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
          value: 18,
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('Deletes existing values', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: { [key: string]: Patch<TestItem> } = {
        a: { value: DELETE_VALUE },
      };

      const expected: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when payload is empty', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload = {};

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when payload is undefined', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload = undefined;

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when payload is null', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload = null;

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when all payload items are invalid', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: { [key: string]: Patch<TestItem> } = {
        a: { id: 'THE NEW ID' },
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when no value is changed', () => {
      // ARRANGE
      const target: Index<TestItem> = {
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
      const payload: { [key: string]: Patch<TestItem> } = {
        a: { value: 7 },
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when no value is deleted', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };
      const payload: { [key: string]: Patch<TestItem> } = {
        a: { value: DELETE_VALUE },
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, parentDef);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });
  });
});
