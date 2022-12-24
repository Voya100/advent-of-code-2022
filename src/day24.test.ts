import { part1, part2 } from './day24';

const input = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

describe('day 24, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(18);
  });
});

describe('day 24, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(54);
  });
});
