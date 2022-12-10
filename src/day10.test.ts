import { parseInput, part1, part2, runInstructions } from './day10';

const input = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

describe('day 10, part 1', () => {
  it('should have correct cycles for simple input', () => {
    const instructions = parseInput(`noop
addx 3
addx -5`);
    const cycleValues = runInstructions(instructions);
    expect(cycleValues).toEqual([1, 1, 1, 4, 4]);
  });

  it('should have correct cycles for slightly larger input', () => {
    const instructions = parseInput(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1`);
    const cycleValues = runInstructions(instructions);
    expect(cycleValues).toEqual([
      1, 1, 16, 16, 5, 5, 11, 11, 8, 8, 13, 13, 12, 12, 4, 4, 17, 17, 21, 21,
      21,
    ]);
  });

  it('should work with test input', () => {
    expect(part1(input)).toBe(13140);
  });
});

describe('day 10, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(`
##  ##  ##  ##  ##  ##  ##  ##  ##  ##  
###   ###   ###   ###   ###   ###   ### 
####    ####    ####    ####    ####    
#####     #####     #####     #####     
######      ######      ######      ####
#######       #######       #######     `);
  });
});
