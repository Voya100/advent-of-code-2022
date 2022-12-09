import { part1, part2 } from './day9';

const input1 = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const input2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

describe('day 9, part 1', () => {
  it('should work with test input 1', () => {
    expect(part1(input1)).toBe(13);
  });
});

describe('day 9, part 2', () => {
  it('should work with test input 1', () => {
    expect(part2(input1)).toBe(1);
  });
  it('should work with test input 2', () => {
    expect(part2(input2)).toBe(36);
  });
});
