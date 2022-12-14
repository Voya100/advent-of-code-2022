import { part1, part2 } from './day14';

const input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

describe('day 14, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(24);
  });
});

describe('day 14, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(93);
  });
});
