// https://adventofcode.com/2022/day/17

import { findPattern } from './utils';

const shapesInput = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`;

const rockShapes = parseRockShapes(shapesInput);

// For debugging
const useVisualise = false;

const LEFT = '<';
const RIGHT = '>';
type Direction = typeof LEFT | typeof RIGHT;
type RockShape = ('' | '#')[][];

export function part1(input: string) {
  const directions = parseInput(input);
  return simulate(directions, 2022);
}

export function part2(input: string) {
  const directions = parseInput(input);
  return simulate(directions, 100000000, true);
}

function parseRockShapes(input: string) {
  return input.split('\n\n').map(parseRockShape);
}

function parseRockShape(rockShapeInput: string) {
  return rockShapeInput
    .split('\n')
    .map((row) => row.split('').map((value) => (value === '.' ? '' : '#')))
    .reverse() as RockShape;
}

function parseInput(input: string) {
  return input.split('') as Direction[];
}

function simulate(
  directions: Direction[],
  rounds: number,
  useFindPattern = false
) {
  const map = [createFloor()];
  let directionIndex = 0;
  let rockIndex = 0;
  const heights: number[] = [];
  for (let i = 0; i < rounds; i++) {
    directionIndex = addRock(
      rockShapes[rockIndex],
      directionIndex,
      directions,
      map
    );
    rockIndex = (rockIndex + 1) % rockShapes.length;
    heights.push(getHighestRockHeight(map));

    if (useFindPattern) {
      // Assumption: Rock height differences will eventually form a pattern
      const patternResult = findPattern(heights);
      if (patternResult) {
        return resolveHeightWithPattern(
          patternResult.patternLength,
          heights,
          directions,
          i,
          directionIndex,
          rockIndex,
          map
        );
      }
    }
  }
  return getHighestRockHeight(map);
}

function addRock(
  rock: RockShape,
  directionIndex: number,
  directions: Direction[],
  map: string[][]
) {
  const height = rock.length;
  const neededMapHeight = getHighestRockHeight(map) + height + 4;
  const heightToAdd = neededMapHeight - map.length;
  for (let i = 0; i < heightToAdd; i++) {
    map.push(createWall());
  }
  let x = 3;
  let y = neededMapHeight - height;
  visualise(map);
  while (true) {
    const direction = directions[directionIndex % directions.length];
    const offset = direction === LEFT ? -1 : 1;
    if (!collides(rock, x + offset, y, map)) {
      x += offset;
    }
    directionIndex++;
    if (collides(rock, x, y - 1, map)) {
      addRockToMap(rock, x, y, map);
      return directionIndex;
    }
    y--;
  }
}

function createFloor() {
  return ['+', '-', '-', '-', '-', '-', '-', '-', '+'];
}

function createWall() {
  return ['|', '', '', '', '', '', '', '', '|'];
}

function getHighestRockHeight(map: string[][]) {
  for (let j = map.length - 1; j > 0; j--) {
    if (map[j].includes('#')) {
      return j;
    }
  }
  return 0;
}

function collides(rock: RockShape, x: number, y: number, map: string[][]) {
  for (let j = 0; j < rock.length; j++) {
    for (let i = 0; i < rock[j].length; i++) {
      if (rock[j][i] && map[y + j][x + i]) {
        return true;
      }
    }
  }
  return false;
}

function addRockToMap(rock: RockShape, x: number, y: number, map: string[][]) {
  for (let j = 0; j < rock.length; j++) {
    for (let i = 0; i < rock[j].length; i++) {
      if (rock[j][i]) {
        map[y + j][x + i] = rock[j][i];
      }
    }
  }
}

function visualise(map: string[][]) {
  if (useVisualise) {
    console.log(
      [...map]
        .reverse()
        .map((row) => row.map((v) => v || '.').join(''))
        .join('\n')
    );
  }
}

function resolveHeightWithPattern(
  patternLength: number,
  heights: number[],
  directions: Direction[],
  roundIndex: number,
  directionIndex: number,
  rockIndex: number,
  map: string[][]
) {
  const rocks = 1000000000000;
  const remainingRounds = rocks - roundIndex - 1;
  const fullPatternRounds = Math.floor(remainingRounds / patternLength);
  const patternStartOffset = rocks - fullPatternRounds * patternLength;
  const patternIncrement =
    heights[patternStartOffset - patternLength] -
    heights[patternStartOffset - 2 * patternLength];
  const patternValue = fullPatternRounds * patternIncrement;
  const roundsToComplete = remainingRounds % patternLength;
  for (let j = 0; j < roundsToComplete; j++) {
    directionIndex = addRock(
      rockShapes[rockIndex],
      directionIndex,
      directions,
      map
    );
    rockIndex = (rockIndex + 1) % rockShapes.length;
    heights.push(getHighestRockHeight(map));
  }
  return getHighestRockHeight(map) + patternValue;
}
