import { LinkedList } from './data-structures/linked-list';
import { part1, part2 } from './day20';

const input = `1
2
-3
3
-2
0
4`;

describe('day 20, part 1', () => {
  it('should not move zero', () => {
    const list1 = new LinkedList([1, 0, 3]);
    list1.moveItemBy(list1.start!.right!, 0, true);
    expect(list1.getValueArray()).toEqual([1, 0, 3]);
  });

  it('should work with test input', () => {
    expect(part1(input)).toBe(3);
  });
});

describe('day 20, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(1623178306);
  });
});
