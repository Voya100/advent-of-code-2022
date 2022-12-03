import { part1, part2 } from './day3';

const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

describe('day 3, part 1', () => {
  it('should work with single rucksacks', () => {
    expect(part1('vJrwpWtwJgWrhcsFMMfFFhFp')).toBe(16);
    expect(part1('jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL')).toBe(38);
    expect(part1('PmmdzqPrVvPwwTWBwg')).toBe(42)
  })

  it('should work with test input', () => {
    expect(part1(input)).toBe(157);
  })
});

describe('day 3, part 2', () => {
  it('should work with single groups', () => {
    expect(part2(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg`)).toBe(18);

    expect(part2(`wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`)).toBe(52);
  })

  it('should work with test input', () => {
    expect(part2(input)).toBe(70);
  })
});