// https://adventofcode.com/2022/day/25

import { sum } from './utils';

export function part1(input: string) {
  const rows = parseInput(input);
  const decimalSum = sum(rows, (row) => convertSnafuToDecimal(row));
  return convertDecimalToSnafu(decimalSum);
}

export function part2(input: string) {
  return null;
}

function parseInput(input: string) {
  return input.split('\n');
}

export function convertSnafuToDecimal(snafu: string) {
  const positiveSide = snafu.replace(/-|=/g, '0');
  const negativeSide = snafu
    .replace(/1|2/g, '0')
    .replaceAll('-', '1')
    .replaceAll('=', '2');
  return Number.parseInt(positiveSide, 5) - Number.parseInt(negativeSide, 5);
}

export function convertDecimalToSnafu(number: number): string {
  if (number === 0 || number === 1 || number === 2) {
    return number.toString();
  }
  if (number === -1) {
    return '-';
  }
  if (number === -2) {
    return '=';
  }

  const exponent = getExponent(number);
  const exponentValue = 5 ** exponent;
  const previousExponentValue = 5 ** (exponent - 1);

  if (number === exponentValue) {
    return '1' + '0'.repeat(exponent);
  }
  if (number === -exponentValue) {
    return '-' + '0'.repeat(exponent);
  }

  if (number > 0) {
    // If negative max value allows reaching the number, the digit at exponent can have higher value than number itself
    if (exponentValue - getMaxValue(exponent) <= number) {
      // Solve digits of remaining value
      const nextDigits = convertDecimalToSnafu(number - exponentValue);
      // Add zeroes if needed
      return '1' + '0'.repeat(exponent - nextDigits.length) + nextDigits;
    }
    if (2 * previousExponentValue - getMaxValue(exponent - 1) <= number) {
      const nextDigits = convertDecimalToSnafu(
        number - 2 * previousExponentValue
      );
      return '2' + '0'.repeat(exponent - 1 - nextDigits.length) + nextDigits;
    }
    const nextDigits = convertDecimalToSnafu(number - previousExponentValue);
    return '1' + '0'.repeat(exponent - 1 - nextDigits.length) + nextDigits;
  }
  // Number is negative
  if (-exponentValue + getMaxValue(exponent) >= number) {
    const nextDigits = convertDecimalToSnafu(number + exponentValue);
    return '-' + '0'.repeat(exponent - nextDigits.length) + nextDigits;
  }
  if (-2 * previousExponentValue + getMaxValue(exponent - 1) >= number) {
    const nextDigits = convertDecimalToSnafu(
      number + 2 * previousExponentValue
    );
    return '=' + '0'.repeat(exponent - 1 - nextDigits.length) + nextDigits;
  }
  const nextDigits = convertDecimalToSnafu(number + previousExponentValue);
  return '-' + '0'.repeat(exponent - 1 - nextDigits.length) + nextDigits;
}

/**
 * Returns exponent to which 5 should be taken to so that result is equal or higher than absolute value of number.
 */
function getExponent(number: number) {
  for (let i = 1; i < Infinity; i++) {
    if (5 ** i >= Math.abs(number)) {
      return i;
    }
  }
  throw new Error('Infinity is not truly infinite');
}

/**
 * Returns maximum value which can be achieved in snafu number system,
 * e.g. "2222..." to the length of numberLength
 */
function getMaxValue(numberLength: number) {
  let value = 0;
  for (let i = 0; i < numberLength; i++) {
    value += 2 * 5 ** i;
  }
  return value;
}
