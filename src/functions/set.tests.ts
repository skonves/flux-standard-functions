import { expect } from 'chai';

import { Definition, set, Index, define } from '..';
import {
  key as keyRule,
  required,
  optional,
  objectOf,
  indexOf,
  array,
} from '../rules';

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

describe('set', () => {
  describe('target primitive array', () => {
    it('Adds a new value', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = 4;

      // ACT
      const result = set(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3, 4]);
    });

    it('No-ops when payload is undefined', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = undefined;

      // ACT
      const result = set(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
      expect(result).to.equal(target);
    });

    it('No-ops when payload is null', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = null;

      // ACT
      const result = set(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
      expect(result).to.equal(target);
    });

    it('No-ops when value already exists', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = 3;

      // ACT
      const result = set(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
      expect(result).to.equal(target);
    });
  });

  describe('target object', () => {
    describe('with a primitive property value', () => {
      it('Adds a new primitive value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'value';
        const payload = 7;
        // const definition: Definition<TestItem> = {
        //   getPayload: x => null,
        //   getPatch: x => ({ [key]: payload }),
        //   getKey: x => x.id,
        //   getDefinitions: key => null,
        // };

        const definition = parentDef;

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

      it('Overwrites an existing primitive value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };
        const key = 'value';
        const payload = 18;

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 18,
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when payload is undefined', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'id';
        const payload = undefined;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when payload is null', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'id';
        const payload = null;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when setting an immutable value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'id';
        const payload = 'THE NEW ID';

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when property value is not updated', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          value: 7,
        };
        const key = 'value';
        const payload = 7;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with an object property value', () => {
      it('Adds a new object value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'child';
        const payload = { id: 'child id', name: 'child name' };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child id', name: 'child name' },
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Overwrites an existing object', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'child id', name: 'child name', value: 7 },
        };
        const key = 'child';
        const payload = { id: 'new child id', name: 'new child name' };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          child: { id: 'new child id', name: 'new child name' },
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when payload is undefined', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'child';
        const payload = undefined;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when payload is null', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'child';
        const payload = null;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when new object is invalid', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'child';
        const payload = { id: 'child id' };

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with an index property value', () => {
      it('Adds a new index value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'children';
        const payload = { a: { id: 'a', name: 'child name' } };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'a', name: 'child name' } },
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Adds a new empty value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'children';
        const payload = {};

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: {},
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Overwrites an existing index', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'a', name: 'child name' } },
        };
        const key = 'children';
        const payload = { b: { id: 'b', name: 'new child name' } };

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { b: { id: 'b', name: 'new child name' } },
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Overwrites an existing index with an empty value', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'a', name: 'child name' } },
        };
        const key = 'children';
        const payload = {};

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: {},
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when payload is undefined', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'a', name: 'child name' } },
        };
        const key = 'children';
        const payload = undefined;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when payload is null', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'a', name: 'child name' } },
        };
        const key = 'children';
        const payload = null;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when new index is invalid', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          children: { a: { id: 'a', name: 'child name' } },
        };
        const key = 'children';
        const payload = { b: { id: 'b' } };

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
    });

    describe('with a primitive array property value', () => {
      it('Adds a new primitive array', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
        };
        const key = 'items';
        const payload = [1, 2, 3];

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [1, 2, 3],
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('Overwrites an existing primitive array', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [1, 2, 3],
        };
        const key = 'items';
        const payload = [3, 4, 5];

        const expected: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [3, 4, 5],
        };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
      });

      it('No-ops when payload is undefined', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [1, 2, 3],
        };
        const key = 'items';
        const payload = undefined;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });

      it('No-ops when new array is null', () => {
        // ARRANGE
        const target: TestItem = {
          id: 'QWERTY',
          name: 'asdf',
          items: [1, 2, 3],
        };
        const key = 'items';
        const payload = null;

        const expected: TestItem = { ...target };

        // ACT
        const result = set(target, key, payload, parentDef);

        // ASSERT
        expect(result).to.deep.equal(expected);
        expect(result).to.equal(target);
      });
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
        getDefinitions: key => null,
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

    it('No-ops when payload is undefined', () => {
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
      const payload = undefined;
      const definition: Definition<TestItem> = {
        getPayload: x => null,
        getPatch: x => null,
        getKey: x => x.id,
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = set(target, payload, definition);

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
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
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
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
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
        getDefinitions: key => null,
      };

      const expected: Index<TestItem> = { ...target };

      // ACT
      const result = set(target, payload, definition);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });
  });
});
