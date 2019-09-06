import { expect } from 'chai';
import { WideWeakMap } from './wide-weak-map';

describe('WideWeakMap', () => {
  describe('delete', () => {
    it('deletes a value with a single key', () => {
      // ARRANGE
      const key = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key], value);

      // ACT
      const result = sut.delete(key);

      // ASSERT
      const x = sut.get(key);
      expect(result).to.be.true;
      expect(x).to.be.undefined;
    });

    it('deletes a value with multiple keys', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key1, key2], value);

      // ACT
      const result = sut.delete(key1, key2);

      // ASSERT
      const x = sut.get(key1, key2);
      expect(result).to.be.true;
      expect(x).to.be.undefined;
    });

    it('no-ops when a single key is not matched', () => {
      // ARRANGE
      const key = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([{}], value);

      // ACT
      const result = sut.delete(key);

      // ASSERT
      expect(result).to.be.false;
    });

    it('no-ops when multiple keys are not matched', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([{}, {}], value);

      // ACT
      const result = sut.delete(key1, key2);

      // ASSERT
      expect(result).to.be.false;
    });

    it('leaves other values with deeper key paths', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const key3 = {};
      const value = {};

      const sut = new WideWeakMap();

      sut.set([key1, key2], value);
      sut.set([key1, key2, key3], value);

      // ACT
      sut.delete([key1, key2]);

      // ASSERT
      const x = sut.get(key1, key2, key3);
      expect(x).to.equal(value);
    });

    it('leaves other values with shallower key paths', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const key3 = {};
      const value = {};

      const sut = new WideWeakMap();

      sut.set([key1, key2], value);
      sut.set([key1, key2, key3], value);

      // ACT
      sut.delete([key1, key2, key3]);

      // ASSERT
      const x = sut.get(key1, key2);
      expect(x).to.equal(value);
    });
  });

  describe('get', () => {
    it('gets a value with a single key', () => {
      // ARRANGE
      const key = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key], value);

      // ACT
      const result = sut.get(key);

      // ASSERT
      expect(result).to.equal(value);
    });

    it('gets a value with multiple keys', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key1, key2], value);

      // ACT
      const result = sut.get(key1, key2);

      // ASSERT
      expect(result).to.equal(value);
    });

    it('returns undefined when a single key is not matched', () => {
      // ARRANGE
      const key = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key], value);

      // ACT
      const result = sut.get({});

      // ASSERT
      expect(result).to.be.undefined;
    });

    it('returns undefined when multiple keys are not matched', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key1, key2], value);

      // ACT
      const result = sut.get({}, {});

      // ASSERT
      expect(result).to.be.undefined;
    });

    it('returns undefined when multiple keys are in the wrong order', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key1, key2], value);

      // ACT
      const result = sut.get(key2, key1);

      // ASSERT
      expect(result).to.be.undefined;
    });
  });

  describe('has', () => {
    it('returns true when a single key is matched', () => {
      // ARRANGE
      const key = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key], value);

      // ACT
      const result = sut.has(key);

      // ASSERT
      expect(result).to.be.true;
    });

    it('returns true when multiple keys are matched', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key1, key2], value);

      // ACT
      const result = sut.has(key1, key2);

      // ASSERT
      expect(result).to.be.true;
    });

    it('returns false when a single key is not matched', () => {
      // ARRANGE
      const key = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key], value);

      // ACT
      const result = sut.has({});

      // ASSERT
      expect(result).to.be.false;
    });

    it('returns false when multiple keys are not matched', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key1, key2], value);

      // ACT
      const result = sut.has({}, {});

      // ASSERT
      expect(result).to.be.false;
    });

    it('returns false when multiple keys are in the wrong order', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();
      sut.set([key1, key2], value);

      // ACT
      const result = sut.has(key2, key1);

      // ASSERT
      expect(result).to.be.false;
    });
  });

  describe('set', () => {
    it('adds a value with a single key', () => {
      // ARRANGE
      const key = {};
      const value = {};

      const sut = new WideWeakMap();

      // ACT
      const x = sut.set([key], value);

      // ASSERT
      const result = sut.get(key);
      expect(result).to.equal(value);
      expect(x).to.equal(sut);
    });

    it('adds a value with multiple keys', () => {
      // ARRANGE
      const key1 = {};
      const key2 = {};
      const value = {};

      const sut = new WideWeakMap();

      // ACT
      const x = sut.set([key1, key2], value);

      // ASSERT
      const result = sut.get(key1, key2);
      expect(result).to.equal(value);
      expect(x).to.equal(sut);
    });
  });
});
