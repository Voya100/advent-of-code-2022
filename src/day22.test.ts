import {
  Facing,
  getNextX,
  getNextY,
  parseInput,
  part1,
  part2,
  rotate,
  RotationDirection
} from './day22';

const input = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

describe('day 22, part 1', () => {
  it('should rotate correctly', () => {
    expect(rotate(Facing.Up, RotationDirection.Right)).toBe(Facing.Right);
    expect(rotate(Facing.Up, RotationDirection.Left)).toBe(Facing.Left);
    expect(rotate(Facing.Right, RotationDirection.Right)).toBe(Facing.Down);
    expect(rotate(Facing.Right, RotationDirection.Left)).toBe(Facing.Up);
    expect(rotate(Facing.Down, RotationDirection.Right)).toBe(Facing.Down);
    expect(rotate(Facing.Down, RotationDirection.Left)).toBe(Facing.Right);
    expect(rotate(Facing.Left, RotationDirection.Right)).toBe(Facing.Up);
    expect(rotate(Facing.Left, RotationDirection.Left)).toBe(Facing.Down);
  });

  it('should wrap around correctly', () => {
    const { map } = parseInput(input);
    expect(
      getNextX(
        {
          x: 0,
          y: 6,
          facing: Facing.Left,
        },
        map
      )
    ).toBe(11);

    expect(
      getNextX(
        {
          x: 11,
          y: 6,
          facing: Facing.Right,
        },
        map
      )
    ).toBe(0);

    expect(
      getNextY(
        {
          x: 5,
          y: 4,
          facing: Facing.Up,
        },
        map
      )
    ).toBe(7);

    expect(
      getNextY(
        {
          x: 5,
          y: 7,
          facing: Facing.Down,
        },
        map
      )
    ).toBe(4);

    expect(
      getNextY(
        {
          x: 10,
          y: 0,
          facing: Facing.Up,
        },
        map
      )
    ).toBe(11);

    expect(
      getNextY(
        {
          x: 10,
          y: 11,
          facing: Facing.Down,
        },
        map
      )
    ).toBe(0);

    expect(
      getNextY(
        {
          x: 12,
          y: 8,
          facing: Facing.Up,
        },
        map
      )
    ).toBe(11);

    expect(
      getNextY(
        {
          x: 12,
          y: 11,
          facing: Facing.Down,
        },
        map
      )
    ).toBe(8);
  });

  it('should work with test input', () => {
    expect(part1(input)).toBe(6032);
  });
});

describe('day 22, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(null);
  });
});
