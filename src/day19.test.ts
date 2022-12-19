import { part1, part2 } from './day19';

const input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

describe('day 19, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(33);
  });
});

describe('day 19, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(62 * 56);
  });
});
