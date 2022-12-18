import { part1, part2 } from './day18';

const input = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

describe('day 18, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(64);
  });
});

describe('day 18, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(58);
  });
});
