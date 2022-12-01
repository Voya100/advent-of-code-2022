// https://adventofcode.com/2022/day/1

import { numberSum } from './utils';

export function day1Part1(input: string) {
  const elfCalories = parseInput(input);
  const elfCalorySums = elfCalories.map(calories => numberSum(calories));
  return Math.max(...elfCalorySums);
}

export function day1Part2(input: string) {
  const elfCalories = parseInput(input);
  const elfCalorySums = elfCalories.map(numberSum);
  const biggestCalorySums = elfCalorySums.sort((a, b) => b - a).slice(0, 3);
  return numberSum(biggestCalorySums);
}

function parseInput(input: string) {
  return input
    .split('\n\n')
    .map(elfInput => elfInput
      .split('\n')
      .map(elfInputRow => +elfInputRow)
    );
}
