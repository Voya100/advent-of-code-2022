// https://adventofcode.com/2022/day/22

export enum Facing {
  Right = 0,
  Down = 1,
  Left = 2,
  Up = 3,
}

export enum RotationDirection {
  Right = 'R',
  Left = 'L',
}

const facings = [Facing.Right, Facing.Down, Facing.Left, Facing.Up];

interface Position {
  x: number;
  y: number;
  facing: Facing;
}

const None = ' ';
const Space = '.';
const Wall = '#';

type Path = (RotationDirection | number)[];

export function part1(input: string) {
  const { path, map } = parseInput(input);
  const position = traversePath(path, map);
  return (position.y + 1) * 1000 + (position.x + 1) * 4 + position.facing;
}

export function part2(input: string) {
  const v = parseInput(input);
  return '';
}

export function parseInput(input: string) {
  const [mapInput, pathInput] = input.split('\n\n');
  return {
    map: parseMap(mapInput),
    path: parsePath(pathInput),
  };
}

function parseMap(input: string) {
  return input.split('\n');
}

function parsePath(input: string): Path {
  const [, ...parts] = input.split(/(\d+)/g);
  return parts.map((part) =>
    [RotationDirection.Right, RotationDirection.Left].includes(
      part as RotationDirection
    )
      ? (part as RotationDirection)
      : +part
  );
}

function traversePath(path: Path, map: string[]) {
  const position: Position = {
    x: map.indexOf(Space),
    y: 0,
    facing: Facing.Right,
  };
  for (const pathPart of path) {
    if (typeof pathPart === 'number') {
      move(pathPart, position, map);
    } else {
      position.facing = rotate(position.facing, pathPart);
    }
  }
  return position;
}

export function rotate(facing: Facing, direction: RotationDirection) {
  if (facing === Facing.Right && direction === RotationDirection.Left) {
    // Handle separately due to negative index not working with remainder
    return Facing.Up;
  }
  const offset = direction === RotationDirection.Right ? 1 : -1;
  return facings[(facings.indexOf(facing) + offset) % facings.length];
}

function move(tiles: number, position: Position, map: string[]) {
  for (let i = 0; i < tiles; i++) {
    const x = getNextX(position, map);
    const y = getNextY(position, map);
    if (map[y][x] === Wall) {
      console.log('stopped', x, y);
      return;
    }
    position.x = x;
    position.y = y;
    console.log('move', position);
  }
}

export function getNextX(position: Position, map: string[], isCube: boolean) {
  if (position.facing === Facing.Up || position.facing === Facing.Down) {
    return position.x;
  }
  const direction = position.facing === Facing.Right ? 1 : -1;
  const x = position.x + direction;
  if (map[position.y][x] === None || map[position.y][x] === undefined) {
    if (position.facing === Facing.Left) {
      // We assume that row always ends at edge of map
      return map[position.y].length - 1;
    }
    const wallIndex = map[position.y].indexOf(Wall);
    const noneIndex = map[position.y].indexOf(Space);
    if (wallIndex !== -1 && noneIndex !== -1) {
      return Math.min(wallIndex, noneIndex);
    } else if (wallIndex !== -1) {
      return wallIndex;
    } else {
      return noneIndex;
    }
  }
  return x;
}

export function getNextY(position: Position, map: string[]) {
  if (position.facing === Facing.Right || position.facing === Facing.Left) {
    return position.y;
  }
  const direction = position.facing === Facing.Down ? 1 : -1;
  const y = position.y + direction;
  if (
    map[y] === undefined ||
    map[y][position.x] === None ||
    map[y][position.x] === undefined
  ) {
    return getFirstWallOrSpaceOnColumn(position.x, position.facing, map);
  }
  return y;
}

function getFirstWallOrSpaceOnColumn(
  x: number,
  facing: Facing.Up | Facing.Down,
  map: string[]
) {
  if (facing === Facing.Up) {
    for (let j = map.length - 1; j >= 0; j--) {
      const value = map[j][x];
      if (value === Wall || value === Space) {
        return j;
      }
    }
    throw new Error('Not found');
  }
  // Facing down
  for (let j = 0; j < map.length; j++) {
    const value = map[j][x];
    if (value === Wall || value === Space) {
      return j;
    }
  }
  throw new Error('Not found');
}
