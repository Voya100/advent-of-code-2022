import { part1, part2 } from './day2';

const input = `A Y
B X
C Z`;

describe('day 2, part 1', () => {
  it('should work with single inputs', () => {
    expect(part1('A Y')).toBe(8);
    expect(part1('B X')).toBe(1);
    expect(part1('C Z')).toBe(6);
  });
  it('should work with test input', () => {
    expect(part1(input)).toBe(15);
  });
});

describe('day 2, part 2', () => {
  it('should work with single inputs', () => {
    expect(part2('A Y')).toBe(4);
    expect(part2('B X')).toBe(1);
    expect(part2('C Z')).toBe(7);
  });

  it('should work with test input', () => {
    expect(part2(input)).toBe(12);
  });
});
