import { part1, part2 } from './day5';

const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

describe('day 5, part 1', () => {
  it('should work with partial input', () => {
    // First command
    console.log();
    expect(part1(input.split('\n').slice(0, 6).join('\n'))).toBe('DCP');
    // Second command
    expect(part1(input.split('\n').slice(0, 7).join('\n'))).toBe(' CZ');
    // Third command
    expect(part1(input.split('\n').slice(0, 8).join('\n'))).toBe('M Z');
  });

  it('should work with test input', () => {
    expect(part1(input)).toBe('CMZ');
  });
});

describe('day 5, part 2', () => {
  it('should work with partial input', () => {
    // First command
    console.log();
    expect(part2(input.split('\n').slice(0, 6).join('\n'))).toBe('DCP');
    // Second command
    expect(part2(input.split('\n').slice(0, 7).join('\n'))).toBe(' CD');
    // Third command
    expect(part2(input.split('\n').slice(0, 8).join('\n'))).toBe('C D');
  });

  it('should work with test input', () => {
    expect(part2(input)).toBe('MCD');
  });
});
