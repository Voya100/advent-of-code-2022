// https://adventofcode.com/2022/day/18

import { ExtendedSet, sum } from './utils';

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

export function part1(input: string) {
  const coordinates = parseInput(input);
  return getSides(coordinates);
}

export function part2(input: string) {
  const coordinates = parseInput(input);
  return getOutsideSides(coordinates);
}

function parseInput(input: string) {
  return input.split('\n').map((row) => {
    const [x, y, z] = row.split(',');
    return { x: +x, y: +y, z: +z };
  });
}

function getSides(coordinates: Coordinate[]) {
  const coordinateSet = new Set(coordinates.map(getCoordinateKey));
  return sum(
    coordinates,
    (coordinate) => getCoordinateSides(coordinate, coordinateSet).length
  );
}

function getOutsideSides(coordinates: Coordinate[]) {
  const coordinateSet = new ExtendedSet(coordinates.map(getCoordinateKey));

  const maxX = Math.max(...coordinates.map((coordinate) => coordinate.x));
  const maxY = Math.max(...coordinates.map((coordinate) => coordinate.y));
  const maxZ = Math.max(...coordinates.map((coordinate) => coordinate.z));

  const coordinateSides = coordinates
    .flatMap((coordinate) => getAdjacentCoordinates(coordinate))
    .filter(
      (coordinate) => !isInsideLava(coordinate, coordinateSet, maxX, maxY, maxZ)
    );

  return coordinateSides.length;
}

function getCoordinateSides(
  coordinate: Coordinate,
  coordinateSet: Set<string>
) {
  const adjacentCoordinates =
    getAdjacentCoordinates(coordinate).map(getCoordinateKey);
  return adjacentCoordinates.filter(
    (adjacentCoordinate) => !coordinateSet.has(adjacentCoordinate)
  );
}

/**
 * Returns true if coordinate is located inside lava flow (either is lava or is air pocket inside it)
 * Goes to all available directions until no more directions are found (= inside lava) or it reaches outside of lava's
 * x/y/z min/max range.
 * All found coordinates inside lava are added to coordinateSet to optimise future queries.
 */
function isInsideLava(
  coordinate: Coordinate,
  coordinateSet: ExtendedSet<string>,
  maxX: number,
  maxY: number,
  maxZ: number
) {
  if (coordinateSet.has(getCoordinateKey(coordinate))) {
    return true;
  }
  const airCoordinates: Coordinate[] = [coordinate];
  const visitedCoordinates = new ExtendedSet<string>();
  while (airCoordinates.length) {
    const nextCoordinate = airCoordinates.pop()!;
    if (
      nextCoordinate.x < 0 ||
      nextCoordinate.x > maxX + 1 ||
      nextCoordinate.y < 0 ||
      nextCoordinate.y > maxY + 1 ||
      nextCoordinate.z < 0 ||
      nextCoordinate.z > maxZ + 1
    ) {
      return false;
    }
    const nextCoordinates = getAdjacentCoordinates(nextCoordinate)
      .map((coordinate) => ({
        coordinate,
        coordinateKey: getCoordinateKey(coordinate),
      }))
      .filter(
        ({ coordinateKey }) =>
          !coordinateSet.has(coordinateKey) &&
          !visitedCoordinates.has(coordinateKey)
      );

    visitedCoordinates.addAll(nextCoordinates.map((c) => c.coordinateKey));
    airCoordinates.push(...nextCoordinates.map((c) => c.coordinate));
  }
  // Optimisation for when same coordinates are cheched from different direction
  coordinateSet.addAll(visitedCoordinates);
  return true;
}

function getAdjacentCoordinates(coordinate: Coordinate) {
  return [
    { x: coordinate.x + 1, y: coordinate.y, z: coordinate.z },
    { x: coordinate.x - 1, y: coordinate.y, z: coordinate.z },
    { x: coordinate.x, y: coordinate.y + 1, z: coordinate.z },
    { x: coordinate.x, y: coordinate.y - 1, z: coordinate.z },
    { x: coordinate.x, y: coordinate.y, z: coordinate.z + 1 },
    { x: coordinate.x, y: coordinate.y, z: coordinate.z - 1 },
  ];
}

function getCoordinateKey({ x, y, z }: Coordinate) {
  return `${x},${y},${z}`;
}
