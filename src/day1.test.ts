import { part1, part2 } from './day1';

const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

describe('day 1, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(24000);
  });
});

describe('day 1, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(45000);
  });
});
