import {
  coordinatesEqual,
  Facing,
  getNextX,
  getNextY,
  mapToCube,
  moveStepInCube,
  parseInput,
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

const simpleCube = `    #...
    ....
    ....
    ....
##..##..###.
##......###.
#...........
............
    ###.
    ....
    ....
    ....
    ####
    ....
    ....
    ....

10R5L5R10L4R5L5`;

describe('day 22, part 1', () => {
  it('should rotate correctly', () => {
    expect(rotate(Facing.Up, RotationDirection.Right)).toBe(Facing.Right);
    expect(rotate(Facing.Up, RotationDirection.Left)).toBe(Facing.Left);
    expect(rotate(Facing.Right, RotationDirection.Right)).toBe(Facing.Down);
    expect(rotate(Facing.Right, RotationDirection.Left)).toBe(Facing.Up);
    expect(rotate(Facing.Down, RotationDirection.Right)).toBe(Facing.Left);
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
    //expect(part1(input)).toBe(6032);
  });
});

describe('day 22, part 2', () => {
  it('should parse simple cube', () => {
    const { map } = parseInput(simpleCube);
    const cube = mapToCube(map, 4);
    expect(cube.length).toBe(6);
    expect(cube[0].position.topLeft).toEqual({ x: -1, y: -1, z: -1 });
    expect(cube[0].position.topRight).toEqual({ x: 1, y: -1, z: -1 });
    expect(cube[0].position.bottomLeft).toEqual({ x: -1, y: 1, z: -1 });
    expect(cube[0].position.bottomRight).toEqual({ x: 1, y: 1, z: -1 });

    expect(cube[1].position.topLeft).toEqual({ x: -1, y: 1, z: -1 });
    expect(cube[1].position.topRight).toEqual({ x: 1, y: 1, z: -1 });
    expect(cube[1].position.bottomLeft).toEqual({ x: -1, y: 1, z: 1 });
    expect(cube[1].position.bottomRight).toEqual({ x: 1, y: 1, z: 1 });

    expect(cube[2].position.topLeft).toEqual({ x: 1, y: 1, z: -1 });
    expect(cube[2].position.topRight).toEqual({ x: 1, y: -1, z: -1 });
    expect(cube[2].position.bottomLeft).toEqual({ x: 1, y: 1, z: 1 });
    expect(cube[2].position.bottomRight).toEqual({ x: 1, y: -1, z: 1 });
  });

  it('should parse test input cube', () => {
    const { map } = parseInput(input);
    const cube = mapToCube(map, 4);
    expect(cube.length).toBe(6);
    const side2 = cube.find((side) => side.x === 0 && side.y === 1)!;
    const side3 = cube.find((side) => side.x === 1 && side.y === 1)!;
    const side4 = cube.find((side) => side.x === 2 && side.y === 1)!;
    const side5 = cube.find((side) => side.x === 2 && side.y === 2)!;
    const side6 = cube.find((side) => side.x === 3 && side.y === 2)!;
    expect(
      coordinatesEqual(side2.position.bottomRight, side3.position.bottomLeft)
    ).toBe(true);
    expect(
      coordinatesEqual(side2.position.topRight, side3.position.topLeft)
    ).toBe(true);
    expect(
      coordinatesEqual(side3.position.bottomRight, side4.position.bottomLeft)
    ).toBe(true);
    expect(
      coordinatesEqual(side3.position.topRight, side4.position.topLeft)
    ).toBe(true);
    expect(
      coordinatesEqual(side4.position.bottomLeft, side5.position.topLeft)
    ).toBe(true);
    expect(
      coordinatesEqual(side4.position.bottomRight, side5.position.topRight)
    ).toBe(true);
    expect(
      coordinatesEqual(side5.position.topRight, side6.position.topLeft)
    ).toBe(true);
    expect(
      coordinatesEqual(side5.position.bottomRight, side6.position.bottomLeft)
    ).toBe(true);
  });

  it('should move to correct locations', () => {
    const { map } = parseInput(input);
    const cube = mapToCube(map, 4);
    const position = {
      side: cube[1],
      x: 3,
      y: 1,
      facing: Facing.Right,
    };
    const side6 = cube.find((side) => side.x === 3 && side.y === 2)!;
    const newPosition = moveStepInCube(position, cube);
    expect(newPosition.side).toBe(side6);
    expect(newPosition.x).toBe(2);
    expect(newPosition.y).toBe(0);
  });

  it('should work with test input', () => {
    expect(part2(input, 4)).toBe(5031);
  });
});
