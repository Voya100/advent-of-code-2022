import { part1, part2 } from './day6';

describe('day 6, part 1', () => {
  it('should work with test inputs', () => {
    expect(part1('mjqjpqmgbljsphdztnvjfqwrcgsmlb')).toBe(7);
    expect(part1('bvwbjplbgvbhsrlpgdmjqwftvncz')).toBe(5);
    expect(part1('nppdvjthqldpwncqszvftbrmjlhg')).toBe(6);
    expect(part1('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).toBe(10);
    expect(part1('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).toBe(11);
  });
});

describe('day 6, part 2', () => {
  it('should work with test inputs', () => {
    expect(part2('mjqjpqmgbljsphdztnvjfqwrcgsmlb')).toBe(19);
    expect(part2('bvwbjplbgvbhsrlpgdmjqwftvncz')).toBe(23);
    expect(part2('nppdvjthqldpwncqszvftbrmjlhg')).toBe(23);
    expect(part2('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).toBe(29);
    expect(part2('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).toBe(26);
  });
});
