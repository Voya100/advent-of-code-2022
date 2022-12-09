import { getRange } from './utils';
// https://adventofcode.com/2022/day/9

enum Direction {
  Up = 'U',
  Down = 'D',
  Right = 'R',
  Left = 'L',
}

interface Step {
  direction: Direction;
  amount: number;
}

interface Coordinate {
  x: number;
  y: number;
}

export function part1(input: string) {
  const steps = parseInput(input);
  const uniqueCoordinates = simulateMovement(steps, 2);
  return uniqueCoordinates.size;
}

export function part2(input: string) {
  const steps = parseInput(input);
  const uniqueCoordinates = simulateMovement(steps, 10);
  return uniqueCoordinates.size;
}

function parseInput(input: string) {
  return input.split('\n').map((row) => {
    const [direction, amount] = row.split(' ');
    return {
      direction: direction as Direction,
      amount: +amount,
    };
  });
}

function simulateMovement(steps: Step[], ropeLength: number) {
  // All knots start as same location
  const knots = getRange(0, ropeLength).map(() => ({ x: 0, y: 0 }));
  const head = knots[0];
  const tail = knots[ropeLength - 1];
  const uniqueCoordinates = new Set<string>([`${tail.x},${tail.y}`]);

  for (const step of steps) {
    for (let i = 0; i < step.amount; i++) {
      simulateHeadMovement(head, step.direction);
      // Update all other knot positions
      for (let knotIndex = 0; knotIndex < ropeLength - 1; knotIndex++) {
        simulateKnotMovement(knots[knotIndex], knots[knotIndex + 1]);
      }
      uniqueCoordinates.add(`${tail.x},${tail.y}`);
    }
  }
  return uniqueCoordinates;
}

function simulateHeadMovement(headKnot: Coordinate, direction: Direction) {
  switch (direction) {
    case Direction.Up:
      headKnot.y--;
      break;
    case Direction.Down:
      headKnot.y++;
      break;
    case Direction.Right:
      headKnot.x++;
      break;
    case Direction.Left:
      headKnot.x--;
      break;
  }
}

/**
 * Knot must always move next to it leading knot if not already (distance = 1, including diagonals)
 * Head always moves 1 step at a time, as does the know that follows it (max movement distance = 1).
 * If knot needs to move, and it is not on same line/row, it moves towards the leading knot diagonally
 */
function simulateKnotMovement(leadingKnot: Coordinate, knot: Coordinate) {
  const xDirection = leadingKnot.x < knot.x ? -1 : 1;
  const yDirection = leadingKnot.y < knot.y ? -1 : 1;
  const xDiff = Math.abs(leadingKnot.x - knot.x);
  const yDiff = Math.abs(leadingKnot.y - knot.y);

  if (
    (xDiff > 1 && leadingKnot.y !== knot.y) ||
    (yDiff > 1 && leadingKnot.x !== knot.x)
  ) {
    // Diagonal
    knot.x += xDirection;
    knot.y += yDirection;
  } else if (xDiff >= 2) {
    knot.x += xDirection;
  } else if (yDiff >= 2) {
    knot.y += yDirection;
  }
}
