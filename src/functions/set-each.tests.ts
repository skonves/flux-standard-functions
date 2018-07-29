import { expect } from 'chai';

import { Definition, Patch, setEach, Index } from '..';

type TestItem = {
  id: string;
  name: string;
  value?: number;
};

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

    it('Does not add an existing value', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = [2, 3];

      // ACT
      const result = setEach(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
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
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => x.id,
      };

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
      const result = setEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => x.id,
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
      const result = setEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when getKey returns falsy', () => {
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
          value: 18,
        },
      ];
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when getPayload returns falsy', () => {
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
          value: 18,
        },
      ];
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
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
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => x.id,
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
      const result = setEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => x.id,
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
      const result = setEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when getKey returns falsy', () => {
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
          value: 18,
        },
      };
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when getKey does not match payload key', () => {
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
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => x.id,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when getPayload returns falsy', () => {
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
          value: 18,
        },
      };
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = setEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });
});
