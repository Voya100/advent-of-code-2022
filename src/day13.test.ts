import { part1, part2, valueComparator } from './day13';

const input = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

describe('day 13, part 1', () => {
  it('should give correct order for individual pairs', () => {
    expect(
      valueComparator([1, 1, 3, 1, 1], [1, 1, 5, 1, 1])
    ).toBeLessThanOrEqual(0);
    expect(valueComparator([[1], [2, 3, 4]], [[1], 4])).toBeLessThanOrEqual(0);
    expect(valueComparator([9], [[8, 7, 6]])).toBeGreaterThan(0);
    expect(
      valueComparator([[4, 4], 4, 4], [[4, 4], 4, 4, 4])
    ).toBeLessThanOrEqual(0);
    expect(valueComparator([7, 7, 7, 7], [7, 7, 7])).toBeGreaterThan(0);
    expect(valueComparator([], [3])).toBeLessThanOrEqual(0);
    expect(valueComparator([[[]]], [[]])).toBeGreaterThan(0);
    expect(
      valueComparator(
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
      )
    ).toBeGreaterThan(0);
  });

  it('should work with test input', () => {
    expect(part1(input)).toBe(13);
  });
});

describe('day 13, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(140);
  });
});
