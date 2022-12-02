import { day2Part1, day2Part2 } from './day2';

const input = `A Y
B X
C Z`;

describe('day 2, part 1', () => {
  it('should work with single inputs', () => {
    expect(day2Part1('A Y')).toBe(8);
    expect(day2Part1('B X')).toBe(1);
    expect(day2Part1('C Z')).toBe(6);
  })
  it('should work with test input', () => {
    expect(day2Part1(input)).toBe(15);
  })
});

describe('day 2, part 2', () => {
  it('should work with single inputs', () => {
    expect(day2Part2('A Y')).toBe(4);
    expect(day2Part2('B X')).toBe(1);
    expect(day2Part2('C Z')).toBe(7);
  })

  it('should work with test input', () => {
    expect(day2Part2(input)).toBe(12);
  })
});