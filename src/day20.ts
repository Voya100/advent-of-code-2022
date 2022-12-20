// https://adventofcode.com/2022/day/20

import { LinkedList } from './data-structures/linked-list';

const decryptionKey = 811589153;

export function part1(input: string) {
  const encryptedFile = parseInput(input);
  const decodedValueList = decode(encryptedFile);
  return getGroveValue(decodedValueList);
}

export function part2(input: string) {
  const encryptedFile = parseInput(input);
  const encryptedFileWithKey = encryptedFile.map(
    (value) => value * decryptionKey
  );
  const decodedValueList = decode(encryptedFileWithKey, 10);
  return getGroveValue(decodedValueList);
}

function parseInput(input: string) {
  return input.split('\n').map((row) => +row);
}

export function decode(values: number[], rounds = 1) {
  const valueList = new LinkedList(values);
  // Take array to keep original order
  const valueItems = valueList.getArray();
  for (let i = 0; i < rounds; i++) {
    for (const item of valueItems) {
      valueList.moveItemBy(item, item.value % (values.length - 1), true);
    }
  }
  return valueList;
}

function getGroveValue(decodedValueList: LinkedList<number>) {
  const firstValue = decodedValueList.find((value) => value === 0)!;
  return (
    decodedValueList.getItemWithOffset(firstValue, 1000, true)!.value +
    decodedValueList.getItemWithOffset(firstValue, 2000, true)!.value +
    decodedValueList.getItemWithOffset(firstValue, 3000, true)!.value
  );
}
