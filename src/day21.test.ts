import { part1, part2 } from './day21';

const input = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

describe('day 21, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(152);
  });
});

describe('day 21, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(301);
  });
});
