import { expect } from 'chai';

import { patch } from './patch';
import { Definition, Patch, DELETE_VALUE, Index } from '..';

type TestItem = {
  id: string;
  name: string;
  value?: number;
};

describe('patch', () => {
  describe('object', () => {
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
  });

  describe('object in index', () => {
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
  });
});
