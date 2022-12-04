import { part1, part2 } from './day4';

const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

describe('day 4, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(2);
  });
});

describe('day 4, part 2', () => {
  it('should work with single assignment pairs', () => {
    expect(part2('5-7,7-9')).toBe(1);
    expect(part2('2-8,3-7')).toBe(1);
    expect(part2('6-6,4-6')).toBe(1);
    expect(part2('2-6,4-8')).toBe(1);
    expect(part2('2-3,4-5')).toBe(0);
  });

  it('should work with test input', () => {
    expect(part2(input)).toBe(4);
  });
});
