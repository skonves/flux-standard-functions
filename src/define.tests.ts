import { expect } from 'chai';
import { define } from './define';
import {
  key,
  required,
  optional,
  objectOf,
  indexOf,
  array,
  immutable,
} from './rules';
import { Patch, DELETE_VALUE, Index } from '.';

describe('define', () => {
  describe('getPayload', () => {
    it('removes extraneous values from input', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
        value?: number;
      };

      const payload: any = {
        id: 'the ID',
        name: 'the NAME',
        value: 7,
        extra: 'prop',
      };

      const expected: TestItem = {
        id: 'the ID',
        name: 'the NAME',
        value: 7,
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
        value: optional(),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('returns falsy when required primitive property is missing', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
        value?: number;
      };

      const payload: any = {
        id: 'the ID',
        value: 7,
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
        value: optional(),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.not.be.ok;
    });

    it('returns value when optional primitive property is missing', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
        value?: number;
      };

      const payload: any = {
        id: 'the ID',
        name: 'the NAME',
      };

      const expected: TestItem = {
        id: 'the ID',
        name: 'the NAME',
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
        value: optional(),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('returns falsy when required child object is invalid', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        child: TestChild;
      };

      type TestChild = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
        child: { id: 'the CHILD ID' },
      };

      // ACT
      const childDefinition = define<TestChild>({
        id: key(),
        name: required(),
      });
      const definition = define<TestItem>({
        id: key(),
        child: required(objectOf(childDefinition)),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.not.be.ok;
    });

    it('removes child object when it is invalid but optional', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        child?: TestChild;
      };

      type TestChild = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
        child: { id: 'the CHILD ID' },
      };

      const expected: TestItem = {
        id: 'the ID',
      };

      // ACT
      const childDefinition = define<TestChild>({
        id: key(),
        name: required(),
      });
      const definition = define<TestItem>({
        id: key(),
        child: optional(objectOf(childDefinition)),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('removes extraneous values from a child object', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        child: TestChild;
      };

      type TestChild = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
        child: {
          id: 'the CHILD ID',
          name: ' the CHILD NAME',
          extraneous: 'value',
        },
      };

      const expected: TestItem = {
        id: 'the ID',
        child: {
          id: 'the CHILD ID',
          name: ' the CHILD NAME',
        },
      };

      // ACT
      const childDefinition = define<TestChild>({
        id: key(),
        name: required(),
      });
      const definition = define<TestItem>({
        id: key(),
        child: required(objectOf(childDefinition)),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('allows a falsy value for a missing but optional child index', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        children?: Index<TestChild>;
      };

      type TestChild = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
      };

      const expected: TestItem = {
        id: 'the ID',
      };

      // ACT
      const childDefinition = define<TestChild>({
        id: key(),
        name: required(),
      });
      const definition = define<TestItem>({
        id: key(),
        children: optional(indexOf(childDefinition)),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('adds an empty index for a required but missing child index', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        children: Index<TestChild>;
      };

      type TestChild = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
      };

      const expected: TestItem = {
        id: 'the ID',
        children: {},
      };

      // ACT
      const childDefinition = define<TestChild>({
        id: key(),
        name: required(),
      });
      const definition = define<TestItem>({
        id: key(),
        children: required(indexOf(childDefinition)),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('removes invalid objects from a child index', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        children: Index<TestChild>;
      };

      type TestChild = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
        children: {
          a: { id: 'a', name: 'the CHILD NAME' },
          b: { id: 'b' },
        },
      };

      const expected: TestItem = {
        id: 'the ID',
        children: {
          a: { id: 'a', name: 'the CHILD NAME' },
        },
      };

      // ACT
      const childDefinition = define<TestChild>({
        id: key(),
        name: required(),
      });
      const definition = define<TestItem>({
        id: key(),
        children: required(indexOf(childDefinition)),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('removes extraneous values from objects in a child index', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        children: Index<TestChild>;
      };

      type TestChild = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
        children: {
          a: { id: 'a', name: 'the CHILD NAME', extraneous: 'value' },
        },
      };

      const expected: TestItem = {
        id: 'the ID',
        children: {
          a: { id: 'a', name: 'the CHILD NAME' },
        },
      };

      // ACT
      const childDefinition = define<TestChild>({
        id: key(),
        name: required(),
      });
      const definition = define<TestItem>({
        id: key(),
        children: required(indexOf(childDefinition)),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('allows a falsy value for a missing but optional child array', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        values?: number[];
      };

      const payload: any = {
        id: 'the ID',
      };

      const expected: TestItem = {
        id: 'the ID',
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        values: optional(array()),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('adds an empty array for a required but missing child array', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        values: number[];
      };

      const payload: any = {
        id: 'the ID',
      };

      const expected: TestItem = {
        id: 'the ID',
        values: [],
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        values: required(array()),
      });
      const result = definition.getPayload(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });

  describe('getPatch', () => {
    it('removes extraneous primitive value', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
        value?: number;
      };

      const payload: any = {
        name: 'the NAME',
        value: 7,
        extraneous: 'value',
      };

      const expected: Patch<TestItem> = {
        name: 'the NAME',
        value: 7,
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
        value: optional(),
      });
      const result = definition.getPatch(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('removes DELETE_VALUE for required property', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
        value: number;
      };

      const payload: any = {
        name: DELETE_VALUE,
        value: 7,
      };

      const expected: Patch<TestItem> = {
        value: 7,
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
        value: required(),
      });
      const result = definition.getPatch(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('removes DELETE_VALUE for immutable property', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
        value: number;
      };

      const payload: any = {
        name: DELETE_VALUE,
        value: 7,
      };

      const expected: Patch<TestItem> = {
        value: 7,
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: immutable(),
        value: required(),
      });
      const result = definition.getPatch(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('removes primitive value for immutable property', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'the ID',
        name: 'the NAME',
      };

      const expected: Patch<TestItem> = {
        name: 'the NAME',
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
      });
      const result = definition.getPatch(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });

    it('returns falsy when input has no valid properties', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
      };

      const payload: any = {
        id: 'new ID',
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
      });
      const result = definition.getPatch(payload);

      // ASSERT
      expect(result).to.not.be.ok;
    });

    it('removes a non-array value for an array property', () => {
      // ARRANGE
      type TestItem = {
        id: string;
        name: string;
        items: number[];
      };

      const payload: any = {
        name: 'the NAME',
        items: 'not an array',
      };

      const expected: Patch<TestItem> = {
        name: 'the NAME',
      };

      // ACT
      const definition = define<TestItem>({
        id: key(),
        name: required(),
        items: array(),
      });
      const result = definition.getPatch(payload);

      // ASSERT
      expect(result).to.deep.equal(expected);
    });
  });

  describe('getKey', () => {
    it('returns a key function for ???');
    it('returns falsy for ???');
  });
});
