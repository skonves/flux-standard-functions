import { expect } from 'chai';
import { Index, index, key, required, define, deindex } from '.';

describe('index', () => {
  it('indexes a collection', () => {
    // ARRANGE
    type Item = { id: string; name: string };
    const itemDef = define<Item>({ id: key(), name: required() });

    const items: Item[] = [
      { id: '123', name: 'item 1' },
      { id: 'abc', name: 'item 2' },
    ];

    const expected: Index<Item> = {
      '123': { id: '123', name: 'item 1' },
      abc: { id: 'abc', name: 'item 2' },
    };

    // ACT
    const result = index(items, itemDef);

    // ASSERT
    expect(result).to.deep.equal(expected);
  });
});

describe('deindex', () => {
  it('deindexes an index', () => {
    // ARRANGE
    type Item = { id: string; name: string };
    const itemDef = define<Item>({ id: key(), name: required() });

    const itemIndex: Index<Item> = {
      '123': { id: '123', name: 'item 1' },
      abc: { id: 'abc', name: 'item 2' },
    };

    const expected: Item[] = [
      { id: '123', name: 'item 1' },
      { id: 'abc', name: 'item 2' },
    ];

    // ACT
    const result = deindex(itemIndex);

    // ASSERT
    expect(result).to.deep.equal(expected);
  });
});
