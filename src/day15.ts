// https://adventofcode.com/2022/day/15

import { sum } from './utils';

interface Coordinate {
  x: number;
  y: number;
}

interface Sensor extends Coordinate {
  closestDistance: number;
  closestBeacon: Coordinate;
}

export function part1(input: string, yRow = 2000000) {
  const sensors = parseInput(input);
  const valueRanges = sensors
    .map((sensor) => valuesInDistanceRange(sensor, yRow))
    .filter((range) => range);
  const distinctRanges = getDistinctRanges(valueRanges);
  const valueSum = sum(distinctRanges, ([xStart, xEnd]) => xEnd - xStart + 1);
  // Beacons overlap on received locations
  const beaconsOnRow = new Set(
    sensors
      .map((sensor) => sensor.closestBeacon)
      .filter((beacon) => beacon.y === yRow)
      .map((beacon) => `${beacon.x},${beacon.y}`)
  ).size;

  return valueSum - beaconsOnRow;
}

export function part2(input: string, maxCoordinate = 4000000) {
  const sensors = parseInput(input);
  const beacon = findBeacon(sensors, maxCoordinate, maxCoordinate);
  return beacon.x * 4000000 + beacon.y;
}

function parseInput(input: string) {
  return input.split('\n').map(parseRow);
}

function parseRow(row: string) {
  // Row format example: "Sensor at x=2, y=18: closest beacon is at x=-2, y=15"
  const filteredRow = row.replace(/[^\d=-]*/g, '');
  const [x1, y1, x2, y2] = filteredRow.split('=').filter((value) => value);
  const sensor: Sensor = {
    x: +x1,
    y: +y1,
    closestBeacon: {
      x: +x2,
      y: +y2,
    },
    closestDistance: 0,
  };
  sensor.closestDistance = getManhattanDistance(sensor, sensor.closestBeacon);
  return sensor;
}

function getManhattanDistance(
  coordinate1: Coordinate,
  coordinate2: Coordinate
) {
  return (
    Math.abs(coordinate2.x - coordinate1.x) +
    Math.abs(coordinate2.y - coordinate1.y)
  );
}

function valuesInDistanceRange(sensor: Sensor, y: number): number[] | null {
  const heightOffset = Math.abs(sensor.y - y);
  const xDiff = sensor.closestDistance - heightOffset;
  if (xDiff < 0) {
    return null;
  }
  return [sensor.x - xDiff, sensor.x + xDiff];
}

/**
 * Return ranges without overlap
 * @param ranges
 * @returns
 */
function getDistinctRanges(ranges: number[][]) {
  let previousRangeEnd = -Infinity;
  let previousRange = [-Infinity, -Infinity];
  ranges.sort(([x1], [x2]) => x1 - x2);
  const distinctRanges: number[][] = [];
  for (const range of ranges) {
    if (range[1] <= previousRangeEnd) {
      continue;
    }
    if (range[0] <= previousRangeEnd) {
      // Combine ranges
      previousRange[1] = range[1];
    } else {
      previousRange = [range[0], range[1]];
      distinctRanges.push(previousRange);
    }
    previousRangeEnd = range[1];
  }
  return distinctRanges;
}

function findBeacon(sensors: Sensor[], maxX: number, maxY: number) {
  for (let j = 0; j <= maxY; j++) {
    const possibleValue = findBeaconFromRow(sensors, j, maxX);
    if (possibleValue) {
      return possibleValue;
    }
  }
  throw new Error('Beacon not found');
}

function findBeaconFromRow(sensors: Sensor[], y: number, maxX: number) {
  const ranges = sensors
    .map((sensor) => valuesInDistanceRange(sensor, y))
    .filter((range) => range && range[1] >= 0 && range[0] <= maxX);
  const distinctRanges = getDistinctRanges(ranges);
  let xEnd = -1;
  if (distinctRanges[distinctRanges.length - 1][1] < maxX) {
    return { x: maxX, y };
  }

  for (const range of distinctRanges) {
    if (range[0] > xEnd + 1) {
      // No overlap and not adjacent => empty spot found
      return { x: xEnd + 1, y };
    }
    xEnd = range[1];
  }
  return null;
}
