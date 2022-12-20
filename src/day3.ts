import { ExtendedSet } from './data-structures/set';
import { numberSum } from './utils';
// https://adventofcode.com/2022/day/3

// Could also use charCodeAt by taking into account index offset (likely more performant), but this is more explicit
// Space in beginning so that indexing starts at 1
const alphabet = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function part1(input: string) {
  const sacks = parseInput1(input);
  const commonItems = sacks.map(findCommonCharacter);
  return numberSum(commonItems.map(getPriority));
}

export function part2(input: string) {
  const sackGroups = parseInput2(input);
  const badgeItems = sackGroups.map(findCommonCharacter).filter((char) => char);
  return numberSum(badgeItems.map(getPriority));
}

function parseInput1(input: string) {
  return input
    .split('\n')
    .map((row) => [
      row.slice(0, Math.floor(row.length / 2)),
      row.slice(Math.floor(row.length / 2), row.length),
    ]);
}

function parseInput2(input: string) {
  return toGroups(input.split('\n'), 3);
}

/**
 * Finds a common character between all strings.
 * Only first common char is returned (in this case there should always be maximum of 1 char)
 */
function findCommonCharacter(strings: string[]) {
  return new ExtendedSet(strings[0].split(''))
    .intersectAll(strings.slice(1))
    .getFistValue();
}

function getPriority(char: string) {
  return alphabet.indexOf(char);
}

function toGroups<T>(items: T[], groupSize: number) {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += groupSize) {
    groups.push(items.slice(i, i + groupSize));
  }
  return groups;
}
