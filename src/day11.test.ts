import { parseMonkey, part1, part2 } from './day11';

const input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

describe('day 11, part 1', () => {
  it('should parse monkey correctly', () => {
    const monkeyInput = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3`;
    const monkey = parseMonkey(monkeyInput);
    expect(monkey.items).toEqual([79, 98]);
    expect(monkey.operator).toBe('*');
    expect(monkey.operationValue1).toBe('old');
    expect(monkey.operationValue2).toBe(19);
    expect(monkey.divisionValue).toBe(23);
    expect(monkey.trueMonkeyIndex).toBe(2);
    expect(monkey.falseMonkeyIndex).toBe(3);
  });

  it('should work with test input', () => {
    expect(part1(input)).toBe(10605);
  });
});

describe('day 11, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(2713310158);
  });
});
