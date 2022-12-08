import { part1, part2 } from './day8';

const input = `30373
25512
65332
33549
35390`;

describe('day 8, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(21);
  });
});

describe('day 8, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(8);
  });
});
