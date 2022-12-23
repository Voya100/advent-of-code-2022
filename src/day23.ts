import { toCountMap } from './utils';
// https://adventofcode.com/2022/day/23

enum Direction {
  North,
  East,
  South,
  West,
}

interface Coordinate {
  x: number;
  y: number;
}

type CoordinateKey = string;

export function part1(input: string) {
  const elves = parseInput(input);
  runRounds(elves, 10);
  return getArea(elves) - elves.length;
}

export function part2(input: string) {
  const elves = parseInput(input);
  return runRounds(elves);
}

function parseInput(input: string) {
  return input
    .split('\n')
    .flatMap((row, y) =>
      row.split('').map((value, x) => (value === '#' ? new Elf(x, y) : null))
    )
    .filter((elf) => elf) as Elf[];
}

function runRounds(elves: Elf[], rounds = Infinity) {
  const directions = [
    Direction.North,
    Direction.South,
    Direction.West,
    Direction.East,
  ];
  for (let i = 0; i < rounds; i++) {
    const moves = runRound(elves, directions);
    if (moves <= 0) {
      return i + 1;
    }
  }
}

function runRound(elfs: Elf[], directions: Direction[]) {
  let moveCount = 0;
  const elfLocations = new Set(elfs.map((elf) => elf.coordinateKey));
  for (const elf of elfs) {
    elf.initProposedCoordinate(elfLocations, directions);
  }
  const proposedLocationCounts = toCountMap(
    elfs.map((elf) => elf.proposedCoordinateKey!).filter((key) => key)
  );
  for (const elf of elfs) {
    if (elf.move(proposedLocationCounts)) {
      moveCount++;
    }
  }
  directions.push(directions.shift()!);
  return moveCount;
}

class Elf {
  coordinate: Coordinate;
  coordinateKey: CoordinateKey;
  proposedCoordinate: Coordinate | null = null;
  proposedCoordinateKey: CoordinateKey | null = null;
  constructor(x: number, y: number) {
    this.coordinate = { x, y };
    this.coordinateKey = getCoordinateKey(x, y);
  }

  initProposedCoordinate(
    elfLocationKeys: Set<CoordinateKey>,
    directions: Direction[]
  ) {
    this.proposedCoordinate = null;
    this.proposedCoordinateKey = null;
    const surroundingCoordinates = [
      getCoordinateKey(this.coordinate.x - 1, this.coordinate.y + 1),
      getCoordinateKey(this.coordinate.x, this.coordinate.y + 1),
      getCoordinateKey(this.coordinate.x + 1, this.coordinate.y + 1),
      getCoordinateKey(this.coordinate.x - 1, this.coordinate.y - 1),
      getCoordinateKey(this.coordinate.x, this.coordinate.y - 1),
      getCoordinateKey(this.coordinate.x + 1, this.coordinate.y - 1),
      getCoordinateKey(this.coordinate.x + 1, this.coordinate.y),
      getCoordinateKey(this.coordinate.x - 1, this.coordinate.y),
    ];

    if (!surroundingCoordinates.some((coord) => elfLocationKeys.has(coord))) {
      // No adjacent elves
      return;
    }

    for (const direction of directions) {
      if (direction === Direction.North) {
        const northCoordinate = {
          x: this.coordinate.x,
          y: this.coordinate.y - 1,
        };
        if (
          !elfLocationKeys.has(
            getCoordinateKey(northCoordinate.x - 1, northCoordinate.y)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(northCoordinate.x, northCoordinate.y)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(northCoordinate.x + 1, northCoordinate.y)
          )
        ) {
          this.proposedCoordinate = northCoordinate;
          this.proposedCoordinateKey = getCoordinateKey(
            northCoordinate.x,
            northCoordinate.y
          );
          return;
        }
      }

      if (direction === Direction.South) {
        const southCoordinate = {
          x: this.coordinate.x,
          y: this.coordinate.y + 1,
        };
        if (
          !elfLocationKeys.has(
            getCoordinateKey(southCoordinate.x - 1, southCoordinate.y)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(southCoordinate.x, southCoordinate.y)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(southCoordinate.x + 1, southCoordinate.y)
          )
        ) {
          this.proposedCoordinate = southCoordinate;
          this.proposedCoordinateKey = getCoordinateKey(
            southCoordinate.x,
            southCoordinate.y
          );
          return;
        }
      }
      if (direction === Direction.East) {
        const eastCoordinate = {
          x: this.coordinate.x + 1,
          y: this.coordinate.y,
        };
        if (
          !elfLocationKeys.has(
            getCoordinateKey(eastCoordinate.x, eastCoordinate.y - 1)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(eastCoordinate.x, eastCoordinate.y)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(eastCoordinate.x, eastCoordinate.y + 1)
          )
        ) {
          this.proposedCoordinate = eastCoordinate;
          this.proposedCoordinateKey = getCoordinateKey(
            eastCoordinate.x,
            eastCoordinate.y
          );
          return;
        }
      }
      if (direction === Direction.West) {
        const westCoordinate = {
          x: this.coordinate.x - 1,
          y: this.coordinate.y,
        };

        if (
          !elfLocationKeys.has(
            getCoordinateKey(westCoordinate.x, westCoordinate.y - 1)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(westCoordinate.x, westCoordinate.y)
          ) &&
          !elfLocationKeys.has(
            getCoordinateKey(westCoordinate.x, westCoordinate.y + 1)
          )
        ) {
          this.proposedCoordinate = westCoordinate;
          this.proposedCoordinateKey = getCoordinateKey(
            westCoordinate.x,
            westCoordinate.y
          );
          return;
        }
      }
    }
  }

  move(proposedLocationCounts: Map<CoordinateKey, number>) {
    if (
      !this.proposedCoordinateKey ||
      proposedLocationCounts.get(this.proposedCoordinateKey)! > 1
    ) {
      return false;
    }
    this.coordinate = this.proposedCoordinate!;
    this.coordinateKey = this.proposedCoordinateKey;
    return true;
  }
}

function getCoordinateKey(x: number, y: number) {
  return `${x},${y}`;
}

function getArea(elfs: Elf[]) {
  const minX = Math.min(...elfs.map((elf) => elf.coordinate.x));
  const maxX = Math.max(...elfs.map((elf) => elf.coordinate.x));
  const minY = Math.min(...elfs.map((elf) => elf.coordinate.y));
  const maxY = Math.max(...elfs.map((elf) => elf.coordinate.y));
  return (maxX - minX + 1) * (maxY - minY + 1);
}

// Fo debugging
function visualise(elves: Elf[]) {
  const maxX = Math.max(...elves.map((elf) => elf.coordinate.x));
  const maxY = Math.max(...elves.map((elf) => elf.coordinate.y));
  const elfLocations = new Set(elves.map((elf) => elf.coordinateKey));
  const rows: string[][] = [];
  for (let j = 0; j <= maxY; j++) {
    const row: string[] = [];
    rows.push(row);
    for (let i = 0; i <= maxX; i++) {
      if (elfLocations.has(getCoordinateKey(i, j))) {
        row.push('#');
      } else {
        row.push('.');
      }
    }
  }
  console.log(rows.map((row) => row.join('')).join('\n'));
}
