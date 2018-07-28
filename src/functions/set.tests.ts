import { expect } from 'chai';

import { Definition, set, Index } from '..';

type TestItem = {
  id: string;
  name: string;
  value?: number;
};

describe('set', () => {
  describe('primitive array', () => {
    it('Adds a new value', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = 4;

      // ACT
      const result = set(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3, 4]);
    });

    it('Does not add an existing value', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = 3;

      // ACT
      const result = set(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
    });
  });

  describe('object', () => {
    it('Adds a new value', () => {
      // ARRANGE
      const target: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };
      const key = 'value';
      const payload = 7;
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: payload }),
        getKey: x => x.id,
      };

      const expected: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
        value: 7,
      };

      // ACT
      const result = set(target, key, payload, definition);

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
      const key = 'value';
      const payload = 18;
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: payload }),
        getKey: x => x.id,
      };

      const expected: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
        value: 18,
      };

      // ACT
      const result = set(target, key, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when patch is falsy', () => {
      // ARRANGE
      const target: TestItem = {
        id: 'QWERTY',
        name: 'asdf',
      };
      const key = 'value';
      const payload = 7;
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
      };

      const expected: TestItem = { ...target };

      // ACT
      const result = set(target, key, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });

  describe('index', () => {
    it('Adds a new item', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
      };
      const payload = {
        id: 'b',
        name: 'name of b',
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
        },
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('Overwrites an existing item', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'original name of b',
          value: 7,
        },
      };
      const payload = {
        id: 'b',
        name: 'new name of b',
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
        },
        b: {
          id: 'b',
          name: 'new name of b',
        },
      };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when payload is falsy', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'original name of b',
          value: 7,
        },
      };
      const payload = null;
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when getPayload returns falsy', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'original name of b',
          value: 7,
        },
      };
      const payload = {
        id: 'b',
        name: 'asdfsadf',
        value: 18,
      };
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when getId returns falsy', () => {
      // ARRANGE
      const target: Index<TestItem> = {
        a: {
          id: 'a',
          name: 'name of a',
        },
        b: {
          id: 'b',
          name: 'original name of b',
          value: 7,
        },
      };
      const payload = {
        id: 'b',
        name: 'asdfsadf',
        value: 18,
      };
      const definition: Definition<TestItem> = {
        getPayload: x => x as TestItem,
        getPatch: x => null,
        getKey: x => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });
});
