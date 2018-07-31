import { expect } from 'chai';

import { Definition, Patch, patchEach, DELETE_VALUE, Index } from '..';

type TestItem = {
  id: string;
  name: string;
  value?: number;
};

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => (x.id === 'a' ? { value: 7 } : null),
        getKey: x => x.id,
        getDefinitions: key => null,
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
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => (x.id === 'a' ? { value: 18 } : null),
        getKey: x => x.id,
        getDefinitions: key => null,
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
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => (x.id === 'a' ? { value: DELETE_VALUE } : null),
        getKey: x => x.id,
        getDefinitions: key => null,
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
      const result = patchEach(target, payload, definition);

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
      const payload: Patch<TestItem>[] = [];
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when patch is falsy', () => {
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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: x.value }),
        getKey: x => x.id,
        getDefinitions: key => null,
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
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: x.value }),
        getKey: x => x.id,
        getDefinitions: key => null,
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
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: x.value }),
        getKey: x => x.id,
        getDefinitions: key => null,
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
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when payload is falsy', () => {
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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });

    it('No-ops when patch is falsy', () => {
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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: x.value }),
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

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
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => ({ value: x.value }),
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = patchEach(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });
  });
});
