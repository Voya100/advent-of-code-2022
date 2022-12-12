import { part1, part2 } from './day12';

const input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

describe('day 12, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(31);
  });
});

describe('day 12, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(29);
  });
});
