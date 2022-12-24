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

interface CubePosition {
  x: number;
  y: number;
  side: CubeSide;
  facing: Facing;
}

interface Coordinate {
  x: number;
  y: number;
  z: number;
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

export function part2(input: string, sideLength = 50) {
  const { path, map } = parseInput(input);
  const cubeSides = mapToCube(map, sideLength);
  const position = traverseCubePath(path, cubeSides);
  return (
    (position.side.y * sideLength + position.y + 1) * 1000 +
    (position.side.x * sideLength + position.x + 1) * 4 +
    position.facing
  );
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

function traverseCubePath(path: Path, cubeSides: CubeSide[]) {
  let position: CubePosition = {
    x: 0,
    y: 0,
    facing: Facing.Right,
    side: cubeSides[0],
  };
  for (const pathPart of path) {
    if (typeof pathPart === 'number') {
      position = moveInCube(pathPart, position, cubeSides);
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
      // Hit wall => stop
      return;
    }
    position.x = x;
    position.y = y;
  }
}
export function getNextX(position: Position, map: string[]) {
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

function isWallOrSpace(value: string) {
  return value === Wall || value === Space;
}

function moveInCube(
  tiles: number,
  position: CubePosition,
  cubeSides: CubeSide[]
) {
  for (let i = 0; i < tiles; i++) {
    const newPosition = moveStepInCube(position, cubeSides);
    if (newPosition.side.values[newPosition.y][newPosition.x] === Wall) {
      // Hit wall => stop
      return position;
    }
    position = newPosition;
  }
  return position;
}

/**
 * Moves a single step in cube.
 * Position keeps track of which cube side it is in, and relative location within that side's values.
 * If movement goes over cube side's edge, the connecting side is fetched and value coordinate is mapped
 * to correct value within that side by utilising side's 3D coordinates to see how the axes should be swapped.
 */
export function moveStepInCube(
  position: CubePosition,
  sides: CubeSide[]
): CubePosition {
  const currentSideValues = position.side.values;
  const sideLength = currentSideValues.length;
  let x = position.x;
  let y = position.y;
  let offset = 0;
  if (position.facing === Facing.Right || position.facing === Facing.Left) {
    const direction = position.facing === Facing.Right ? 1 : -1;
    x = position.x + direction;
    offset = y;
    if (isWallOrSpace(currentSideValues[y][x])) {
      return { x, y, side: position.side, facing: position.facing };
    }
  }
  if (position.facing === Facing.Down || position.facing === Facing.Up) {
    const direction = position.facing === Facing.Down ? 1 : -1;
    y = position.y + direction;
    offset = x;
    if (currentSideValues[y] && isWallOrSpace(currentSideValues[y][x])) {
      return { x, y, side: position.side, facing: position.facing };
    }
  }
  // Out of bounds => Find side to which position should go
  const nextSide = sides.find((side) =>
    position.side.isFacingSide(side, position.facing)
  )!;
  const edgeCoordinates = position.side.getCoordinates(position.facing);
  const facingTowardsCurrentSide = nextSide.getFacing(
    edgeCoordinates[0],
    edgeCoordinates[1]
  );
  const nextSideEdgeCoordinates = nextSide.getCoordinates(
    facingTowardsCurrentSide
  );
  const directionReversed = !coordinatesEqual(
    edgeCoordinates[0],
    nextSideEdgeCoordinates[0]
  );
  if (
    facingTowardsCurrentSide === Facing.Right ||
    facingTowardsCurrentSide === Facing.Left
  ) {
    return {
      side: nextSide,
      facing: getOppositeFacing(facingTowardsCurrentSide),
      x: facingTowardsCurrentSide === Facing.Left ? 0 : sideLength - 1,
      y: directionReversed ? sideLength - offset - 1 : offset,
    };
  }

  if (
    facingTowardsCurrentSide === Facing.Down ||
    facingTowardsCurrentSide === Facing.Up
  ) {
    return {
      side: nextSide,
      facing: getOppositeFacing(facingTowardsCurrentSide),
      x: directionReversed ? sideLength - offset - 1 : offset,
      y: facingTowardsCurrentSide === Facing.Up ? 0 : sideLength - 1,
    };
  }

  throw new Error('Invalid facing');
}

/**
 * Finds all cube sides from map and returns array of Side objects.
 * For each side is determined its edge coordinates (x,y,z).
 * When moving between adjacent sides, coordinates of previous side are rotated 90 degrees by desired axis
 * to get correct coordinates.
 */
export function mapToCube(map: string[], sideLength: number) {
  const sideValues: string[][][] = getCubeSideValues(map, sideLength);
  const firstSideX = sideValues[0].findIndex((values) =>
    isWallOrSpace(values[0][0])
  );
  const sides = [
    // The coordinates of first side don't matter much, as long as it's a valid square.
    // To keep matters simple will assume a cube with width of 2, coordinate (0,0,0) being in its centre
    // Scaling of the cube does not matter, since values are only used to match side edges and to resolve correct value directions
    new CubeSide(
      firstSideX,
      0,
      {
        topLeft: {
          x: -1,
          y: -1,
          z: -1,
        },
        topRight: {
          x: 1,
          y: -1,
          z: -1,
        },
        bottomLeft: {
          x: -1,
          y: 1,
          z: -1,
        },
        bottomRight: {
          x: 1,
          y: 1,
          z: -1,
        },
      },
      sideValues[0][firstSideX]
    ),
  ];
  const sidesToProcess = [sides[0]];
  while (sidesToProcess.length) {
    const sideToProcess = sidesToProcess.pop()!;
    const adjacentSides = getAdjacentSides(
      sideToProcess.x,
      sideToProcess.y,
      sideValues
    ).filter(({ values }) => !sides.find((s) => s.values === values));
    for (const adjacentSide of adjacentSides) {
      // Create new side which has location that is rotated by 90 degrees relative to previous side.
      const side = new CubeSide(
        adjacentSide.x,
        adjacentSide.y,
        sideToProcess.getRotatedCoordinates(adjacentSide.facing),
        adjacentSide.values
      );

      sides.push(side);
      sidesToProcess.push(side);
    }
  }
  return sides;
}

/**
 * Returns values of each individual side.
 */
function getCubeSideValues(map: string[], sideLength: number) {
  const sideValues: string[][][] = [];
  for (let j = 0; j < map.length / sideLength; j++) {
    const row: string[][] = [];
    for (let i = 0; i < map[j * sideLength].length / sideLength; i++) {
      const side: string[] = [];
      for (let sideY = 0; sideY < sideLength; sideY++) {
        side.push(
          map[j * sideLength + sideY].slice(
            i * sideLength,
            (i + 1) * sideLength
          )
        );
      }
      row.push(side);
    }
    sideValues.push(row);
  }
  return sideValues;
}

function getAdjacentSides(x: number, y: number, sides: string[][][]) {
  return [
    { x: x + 1, y: y, facing: Facing.Right },
    { x: x - 1, y: y, facing: Facing.Left },
    { x: x, y: y + 1, facing: Facing.Down },
    { x: x, y: y - 1, facing: Facing.Up },
  ]
    .filter(
      ({ x, y }) => sides[y] && sides[y][x] && isWallOrSpace(sides[y][x][0][0])
    )
    .map((value) => ({ ...value, values: sides[value.y][value.x] }));
}

/**
 * Represent a side/face of a cube.
 * The side's values are at position (x*sideLength,y*sideLength) in original input.
 * Other than that, x/y does not directly relate to values inside the side.
 * Position represents where values array's top/bottom left/right values coordinates are in 3D space.
 * The coordinate values themself use different value scaling (x/y/z in range [-1,1]), making them separate from location
 * inside the values.
 */
class CubeSide {
  constructor(
    public x: number,
    public y: number,
    public position: {
      topLeft: Coordinate;
      topRight: Coordinate;
      bottomLeft: Coordinate;
      bottomRight: Coordinate;
    },
    public values: string[]
  ) {}

  /**
   * Returns coordinates of side's edges on desired facing direction.
   */
  getCoordinates(facing: Facing) {
    switch (facing) {
      case Facing.Up:
        return [this.position.topLeft, this.position.topRight];
      case Facing.Down:
        return [this.position.bottomLeft, this.position.bottomRight];
      case Facing.Right:
        return [this.position.topRight, this.position.bottomRight];
      case Facing.Left:
        return [this.position.topLeft, this.position.bottomLeft];
    }
  }

  /**
   * Returns true if given side is on "facing" direction of this side.
   */
  isFacingSide(side: CubeSide, facing: Facing) {
    if (side === this) {
      return false;
    }
    const [coord1, coord2] = this.getCoordinates(facing);
    return side.hasCoordinate(coord1) && side.hasCoordinate(coord2);
  }

  /**
   * Returns the facing on which the provided edge corner coordinates are located.
   */
  getFacing(edgeCoordinate1: Coordinate, edgeCoordinate2: Coordinate) {
    for (const facing of facings) {
      if (
        this.getCoordinates(facing).every((coord) =>
          [edgeCoordinate1, edgeCoordinate2].some((coord2) =>
            coordinatesEqual(coord, coord2)
          )
        )
      ) {
        return facing;
      }
    }
    throw new Error('Facing not found');
  }

  hasCoordinate(coordinate: Coordinate) {
    return (
      coordinatesEqual(coordinate, this.position.topLeft) ||
      coordinatesEqual(coordinate, this.position.topRight) ||
      coordinatesEqual(coordinate, this.position.bottomLeft) ||
      coordinatesEqual(coordinate, this.position.bottomRight)
    );
  }

  /**
   * Returns position, in which this side's position coordinates are rotated
   * by 90 degrees in the direction of facing.
   */
  getRotatedCoordinates(facing: Facing) {
    const [coord1, coord2] = this.getCoordinates(facing);
    let direction = [Facing.Left, Facing.Down].includes(facing) ? 1 : -1;
    if (coord1.x !== coord2.x) {
      if (coord1.x > coord2.x) {
        direction *= -1;
      }
      return {
        topLeft: rotateByXAxis(this.position.topLeft, direction),
        topRight: rotateByXAxis(this.position.topRight, direction),
        bottomLeft: rotateByXAxis(this.position.bottomLeft, direction),
        bottomRight: rotateByXAxis(this.position.bottomRight, direction),
      };
    }
    if (coord1.y !== coord2.y) {
      if (coord1.y > coord2.y) {
        direction *= -1;
      }
      return {
        topLeft: rotateByYAxis(this.position.topLeft, direction),
        topRight: rotateByYAxis(this.position.topRight, direction),
        bottomLeft: rotateByYAxis(this.position.bottomLeft, direction),
        bottomRight: rotateByYAxis(this.position.bottomRight, direction),
      };
    }
    if (coord1.z !== coord2.z) {
      if (coord1.z > coord2.z) {
        direction *= -1;
      }
      return {
        topLeft: rotateByZAxis(this.position.topLeft, direction),
        topRight: rotateByZAxis(this.position.topRight, direction),
        bottomLeft: rotateByZAxis(this.position.bottomLeft, direction),
        bottomRight: rotateByZAxis(this.position.bottomRight, direction),
      };
    }
    throw new Error('Invalid rotation');
  }
}

export function coordinatesEqual(coord1: Coordinate, coord2: Coordinate) {
  return (
    coord1.x === coord2.x && coord1.y === coord2.y && coord1.z === coord2.z
  );
}

function getOppositeFacing(facing: Facing) {
  switch (facing) {
    case Facing.Up:
      return Facing.Down;
    case Facing.Down:
      return Facing.Up;
    case Facing.Right:
      return Facing.Left;
    case Facing.Left:
      return Facing.Right;
    default:
      throw new Error('Unknown facing');
  }
}

function rotateByXAxis(
  { x, y, z }: { x: number; y: number; z: number },
  direction = 1
) {
  return {
    x,
    y: -direction * z,
    z: direction * y,
  };
}

function rotateByYAxis(
  { x, y, z }: { x: number; y: number; z: number },
  direction = 1
) {
  return {
    x: direction * z,
    y,
    z: -direction * x,
  };
}

function rotateByZAxis(
  { x, y, z }: { x: number; y: number; z: number },
  direction = 1
) {
  return {
    x: -direction * y,
    y: direction * x,
    z,
  };
}
