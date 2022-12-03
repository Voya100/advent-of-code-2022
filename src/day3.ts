import { numberSum } from './utils';
// https://adventofcode.com/2022/day/3

// Could also use charCodeAt by taking into account index offset (likely more performant), but this is more explicit
const alphabet = [
  '', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export function part1(input: string) {
  const sacks = parseInput1(input);
  const commonItems = sacks.map(findCommonCharacter);
  return numberSum(commonItems.map(getPriority));
}

export function part2(input: string) {
  const sackGroups = parseInput2(input);
  const badgeItems = sackGroups.map(findCommonCharacter).filter(char => char);
  return numberSum(badgeItems.map(getPriority));
}

function parseInput1(input: string) {
  return input.split('\n')
    .map(row => [
      row.slice(0, Math.floor(row.length / 2)),
      row.slice(Math.floor(row.length / 2), row.length)
    ]);
}

function parseInput2(input: string) {
  return toGroups(input.split('\n'), 3);
}

/**
 * Finds a common character between all strings.
 * Assumes that strings has at least 2 strings
 * Only first common char is returned (in this case there should always be maximum of 1 char)
 */
function findCommonCharacter(strings: string[]) {
  const commonCharacters = new Set(strings[0].split(''));
  for (let i = 1; i < strings.length; i++) {
    for (let char of commonCharacters) {
      // For an input size this small it's faster to use includes of string instead of getting distinct chars with Set (~25 % faster)
      if (!strings[i].includes(char)) {
        commonCharacters.delete(char);
      }
    }
  }
  const [commonChar] = commonCharacters;
  return commonChar;
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