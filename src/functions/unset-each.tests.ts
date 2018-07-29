import { expect } from 'chai';

import { unsetEach, Index } from '..';

type TestItem = {
  id: string;
  name: string;
  value?: number;
};

describe('unsetEach', () => {
  describe('primitive array', () => {
    it('Removes existing values', () => {
      // ARRANGE
      const target = [1, 2, 3, 4];
      const payload = [3, 4];

      // ACT
      const result = unsetEach(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2]);
    });

    it('No-ops when values do not exist', () => {
      // ARRANGE
      const target = [1, 2, 3];
      const payload = [4, 5];

      // ACT
      const result = unsetEach(target, payload);

      // ASSERT
      expect(result).to.have.members([1, 2, 3]);
      expect(result).to.equal(target);
    });
  });

  describe('primitive array', () => {
    it('Removes existing items', () => {
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
      const payload = ['a'];

      const expected = {
        b: {
          id: 'b',
          name: 'name of b',
        },
      };

      // ACT
      const result = unsetEach(target, payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('No-ops when values do not exist', () => {
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
      const payload = ['not a key'];

      const expected = { ...target };

      // ACT
      const result = unsetEach(target, payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
      expect(result).to.equal(target);
    });
  });
});
