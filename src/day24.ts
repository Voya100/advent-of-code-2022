import { MinHeap } from './data-structures/heap';
// https://adventofcode.com/2022/day/24

enum Direction {
  Right = '>',
  Left = '<',
  Up = 'v',
  Down = '^',
}

interface Blizzard {
  x: number;
  y: number;
  direction: Direction;
}

interface Coordinate {
  x: number;
  y: number;
}

export function part1(input: string) {
  const { blizzards, mapTemplate } = parseInput(input);
  const blizzardLocationsByRound = getBlizzardLocations(blizzards, mapTemplate);
  const start = {
    x: 1,
    y: 0,
  };
  const goal = {
    x: blizzardLocationsByRound[0][0].length - 2,
    y: blizzardLocationsByRound[0].length - 1,
  };
  return getQuickestPath(blizzardLocationsByRound, start, goal, 0);
}

export function part2(input: string) {
  const { blizzards, mapTemplate } = parseInput(input);
  const blizzardLocationsByRound = getBlizzardLocations(blizzards, mapTemplate);
  const start = {
    x: 1,
    y: 0,
  };
  const goal = {
    x: blizzardLocationsByRound[0][0].length - 2,
    y: blizzardLocationsByRound[0].length - 1,
  };
  const toEndTime = getQuickestPath(blizzardLocationsByRound, start, goal, 0);
  const toStartTime = getQuickestPath(
    blizzardLocationsByRound,
    goal,
    start,
    toEndTime
  );
  const backToEndTime = getQuickestPath(
    blizzardLocationsByRound,
    start,
    goal,
    toStartTime
  );
  return backToEndTime;
}

function parseInput(input: string) {
  const blizzards = input
    .split('\n')
    .flatMap((row, y) =>
      row
        .split('')
        .map((value, x) =>
          value !== '#' && value !== '.'
            ? { x, y, direction: value as Direction }
            : null
        )
    )
    .filter((blizzard) => blizzard) as Blizzard[];
  const mapTemplate = input
    .split('\n')
    .map((row) => row.split('').map((value) => (value === '#' ? value : '')));
  return {
    blizzards,
    mapTemplate,
  };
}

/**
 * Find quickest path by using A* search.
 * Uses min heap where cost value is min distance + time so far.
 * At each step it's possible to either move to one of the available directions, or to stay still (if no blizzard is coming).
 * Distinct states are identified by location and roundId.
 */
function getQuickestPath(
  blizzardLocationsByRound: string[][][],
  start: Coordinate,
  goal: Coordinate,
  startRound: number
) {
  const pathHeap = new MinHeap<Path>((path) => path.minTime);
  const visitedStates = new Set<string>();
  const roundCycleLength =
    (blizzardLocationsByRound[0].length - 2) *
    (blizzardLocationsByRound[0][0].length - 2);

  const startPath = new Path(
    start.x,
    start.y,
    startRound,
    goal,
    roundCycleLength
  );
  pathHeap.addItem(startPath);

  while (pathHeap.length) {
    const nextQuickestPath = pathHeap.pop();
    if (visitedStates.has(nextQuickestPath.getId())) {
      continue;
    }
    if (nextQuickestPath.x === goal.x && nextQuickestPath.y === goal.y) {
      return nextQuickestPath.minTime;
    }
    visitedStates.add(nextQuickestPath.getId());
    const adjacentPaths = nextQuickestPath
      .getAdjacentPaths(blizzardLocationsByRound, goal, roundCycleLength)
      .filter((path) => !visitedStates.has(path.getId()));
    pathHeap.addItems(adjacentPaths);
  }
  throw new Error('Path not found');
}

class Path {
  minTime: number;
  roundId: number;
  constructor(
    public x: number,
    public y: number,
    public time: number,
    goal: Coordinate,
    roundCycleLength: number
  ) {
    this.minTime = goal.x - x + (goal.y - y) + time;
    this.roundId = time % roundCycleLength;
  }

  getId() {
    return `${this.roundId}:${this.x},${this.y}`;
  }

  getAdjacentPaths(
    blizzardLocationsByRound: string[][][],
    goal: Coordinate,
    roundCycleLength: number
  ) {
    const blizzardLocations = blizzardLocationsByRound[this.roundId];
    return this.getAdjacentCoordinates()
      .filter(({ x, y }) => blizzardLocations[y] && !blizzardLocations[y][x])
      .map(({ x, y }) => new Path(x, y, this.time + 1, goal, roundCycleLength));
  }

  private getAdjacentCoordinates() {
    return [
      { x: this.x + 1, y: this.y },
      { x: this.x - 1, y: this.y },
      { x: this.x, y: this.y + 1 },
      { x: this.x, y: this.y - 1 },
      // Note: Same coordinate also included, since staying still is one option
      { x: this.x, y: this.y },
    ];
  }
}

/**
 * Blizzard patterns repeat. Get all patterns.
 */
function getBlizzardLocations(blizzards: Blizzard[], mapTemplate: string[][]) {
  const locatiobsByRound: string[][][] = [];
  const rounds = (mapTemplate.length - 2) * (mapTemplate[0].length - 2);
  for (let i = 0; i < rounds; i++) {
    const map = JSON.parse(JSON.stringify(mapTemplate)) as string[][];
    for (const blizzard of blizzards) {
      moveBlizzard(blizzard, mapTemplate);
      // Number of duplicates irrelevant, simply mark as "used".
      map[blizzard.y][blizzard.x] = '+';
    }
    locatiobsByRound.push(map);
  }
  return locatiobsByRound;
}

function moveBlizzard(blizzard: Blizzard, mapTemplate: string[][]) {
  if (blizzard.direction === Direction.Right) {
    blizzard.x++;
    if (mapTemplate[blizzard.y][blizzard.x]) {
      blizzard.x = 1;
    }
  } else if (blizzard.direction === Direction.Left) {
    blizzard.x--;
    if (mapTemplate[blizzard.y][blizzard.x]) {
      blizzard.x = mapTemplate[0].length - 2;
    }
  } else if (blizzard.direction === Direction.Down) {
    blizzard.y--;
    if (mapTemplate[blizzard.y][blizzard.x]) {
      blizzard.y = mapTemplate.length - 2;
    }
  } else if (blizzard.direction === Direction.Up) {
    blizzard.y++;
    if (mapTemplate[blizzard.y][blizzard.x]) {
      blizzard.y = 1;
    }
  }
}
