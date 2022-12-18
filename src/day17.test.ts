import { part1, part2 } from './day17';

const input = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

describe('day 17, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(3068);
  });
});

describe('day 17, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(1514285714288);
  });
});
