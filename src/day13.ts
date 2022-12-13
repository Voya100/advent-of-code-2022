import { numberSum } from './utils';
// https://adventofcode.com/2022/day/13

type ComparableValue = number | ComparableValue[];

export function part1(input: string) {
  const packetPairs = parseInput(input);
  const validPairIndices: number[] = [];
  for (let i = 0; i < packetPairs.length; i++) {
    if (valueComparator(packetPairs[i][0], packetPairs[i][1]) <= 0) {
      validPairIndices.push(i + 1);
    }
  }
  return numberSum(validPairIndices);
}

export function part2(input: string) {
  const dividerPacket1 = [[2]];
  const dividerPacket2 = [[6]];
  const packets = parseInput(input).flatMap((pair) => pair);
  packets.push(dividerPacket1, dividerPacket2);
  packets.sort(valueComparator);
  return (
    (packets.indexOf(dividerPacket1) + 1) *
    (packets.indexOf(dividerPacket2) + 1)
  );
}

function parseInput(input: string): [ComparableValue, ComparableValue][] {
  return input.split('\n\n').map((pairInput) => {
    const rows = pairInput.split('\n');
    return rows.map((row) => JSON.parse(row)) as [
      ComparableValue,
      ComparableValue
    ];
  });
}

/**
 * Returns negative if in correct order, positive if in wrong order and 0 if equal order
 */
export function valueComparator(
  value1: ComparableValue,
  value2: ComparableValue
): number {
  if (typeof value1 === 'number' && typeof value2 === 'number') {
    return value1 - value2;
  }
  if (typeof value1 === 'number') {
    value1 = [value1];
  }
  if (typeof value2 === 'number') {
    value2 = [value2];
  }

  const minLength = Math.min(value1.length, value2.length);
  for (let i = 0; i < minLength; i++) {
    const orderValue = valueComparator(value1[i], value2[i]);
    if (orderValue !== 0) {
      return orderValue;
    }
  }
  return value1.length - value2.length;
}
