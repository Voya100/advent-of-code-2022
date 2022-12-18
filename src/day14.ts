// https://adventofcode.com/2022/day/14

interface Coordinate {
  x: number;
  y: number;
}

export function part1(input: string) {
  return getSandCount(input, false);
}

export function part2(input: string) {
  return getSandCount(input, true, 2);
}

function getSandCount(input: string, hasFloor: boolean, floorOffset = 0) {
  const paths = parseInput(input);
  const maxY = Math.max(
    ...paths.flatMap((path) => path).map((coordinate) => coordinate.y)
  );
  const coordinates = getRockCoordinates(paths);
  const startCoordinate: Coordinate = { x: 500, y: 0 };
  let nextCoordinate: Coordinate | null = startCoordinate;
  let sandCounter = 0;
  while (nextCoordinate !== null) {
    nextCoordinate = getNextCoordinate(
      startCoordinate,
      maxY + floorOffset,
      hasFloor,
      coordinates
    );
    if (nextCoordinate) {
      coordinates.add(getCoordinateKey(nextCoordinate.x, nextCoordinate.y));
      sandCounter++;
      if (
        nextCoordinate.x === startCoordinate.x &&
        nextCoordinate.y === startCoordinate.y
      ) {
        return sandCounter;
      }
    }
  }
  return sandCounter;
}

function parseInput(input: string) {
  return input.split('\n').map(parseRow);
}

function parseRow(row: string): Coordinate[] {
  return row.split(' -> ').map((coordInput) => {
    const [x, y] = coordInput.split(',');
    return {
      x: +x,
      y: +y,
    };
  });
}

function getRockCoordinates(paths: Coordinate[][]) {
  const coordinates = new Set<string>();
  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      const coordinateKeys = getPathLineCoordinates(path[i], path[i + 1]);
      for (const coordinate of coordinateKeys) {
        coordinates.add(getCoordinateKey(coordinate.x, coordinate.y));
      }
    }
  }
  return coordinates;
}

function getPathLineCoordinates(
  start: Coordinate,
  end: Coordinate
): Coordinate[] {
  // This algorithm could be heavily optimised by remembering previous positions
  // as possible starting points instead of always starting from the beginning.
  // Performance is not an issue for this input size, so will leave it as it is
  const coordinates: Coordinate[] = [];
  if (start.x !== end.x) {
    const direction = start.x <= end.x ? 1 : -1;
    const condition =
      start.x <= end.x
        ? (i: number) => start.x + i <= end.x
        : (i: number) => start.x + i >= end.x;
    for (let i = 0; condition(i); i += direction) {
      coordinates.push({ x: start.x + i, y: start.y });
    }
    return coordinates;
  }
  const direction = start.y <= end.y ? 1 : -1;
  const condition =
    start.y <= end.y
      ? (i: number) => start.y + i <= end.y
      : (i: number) => start.y + i >= end.y;
  for (let i = 0; condition(i); i += direction) {
    coordinates.push({ x: start.x, y: start.y + i });
  }
  return coordinates;
}

function getNextCoordinate(
  start: Coordinate,
  maxY: number,
  hasFloor: boolean,
  filledCoordinates: Set<string>
) {
  let x = start.x;
  for (let j = start.y + 1; j <= maxY; j++) {
    if (j === maxY && hasFloor) {
      return { x, y: j - 1 };
    }
    if (!filledCoordinates.has(getCoordinateKey(x, j))) {
      continue;
    }
    // There is rock/sand in current location, so check left/right side
    if (!filledCoordinates.has(getCoordinateKey(x - 1, j))) {
      x -= 1;
      continue;
    }
    if (!filledCoordinates.has(getCoordinateKey(x + 1, j))) {
      x += 1;
      continue;
    }
    // Rock/sand below on both diagonal directions
    return { x, y: j - 1 };
  }
  // Outside of coordinate range
  return null;
}

function getCoordinateKey(x: number, y: number) {
  return `${x},${y}`;
}
