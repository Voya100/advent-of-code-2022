import {
  convertDecimalToSnafu,
  convertSnafuToDecimal,
  part1,
  part2,
} from './day25';

const input = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

const exampleValues = [
  [1, '1'],
  [2, '2'],
  [3, '1='],
  [4, '1-'],
  [5, '10'],
  [6, '11'],
  [7, '12'],
  [8, '2='],
  [9, '2-'],
  [10, '20'],
  [15, '1=0'],
  [20, '1-0'],
  [2022, '1=11-2'],
  [12345, '1-0---0'],
  [314159265, '1121-1110-1=0'],
] as const;

describe('day 25, part 1', () => {
  describe('Snafu => decimal', () => {
    for (const [decimal, snafu] of exampleValues) {
      it(`should convert ${snafu} => ${decimal}`, () => {
        expect(convertSnafuToDecimal(snafu)).toBe(decimal);
      });
    }
  });

  describe('Decimal => snafu', () => {
    for (const [decimal, snafu] of exampleValues) {
      it(`should convert ${decimal} => ${snafu}`, () => {
        expect(convertDecimalToSnafu(decimal)).toBe(snafu);
      });
    }
  });

  it('should work with test input', () => {
    expect(part1(input)).toBe('2=-1=0');
  });
});

describe('day 25, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(null);
  });
});
