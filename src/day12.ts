// https://adventofcode.com/2022/day/12

import { BfsNode, findTargetWithBfs } from './algorithms/bfs';

const START = 'S';
const END = 'E';

interface HikeOptions {
  elevationDirectionReversed: boolean;
}

interface HikeLocation {
  name: string;
  height: number;
  x: number;
  y: number;
}

export function part1(input: string) {
  const nodes = parseInput(input);
  const nodeList = nodes.flatMap((nodeRow) => nodeRow);
  const start = nodeList.find((node) => node.value.name === START);
  const end = nodeList.find((node) => node.value.name === END);
  findTargetWithBfs(start, (node) => node === end, {
    elevationDirectionReversed: false,
  });
  return end.getDistanceToStart();
}

export function part2(input: string) {
  const nodes = parseInput(input);
  const nodeList = nodes.flatMap((nodeRow) => nodeRow);
  const targetHeight = 'a'.charCodeAt(0);
  const end = nodeList.find((node) => node.value.name === END);
  // Search from end to start, since distance is same either way
  const start = findTargetWithBfs(
    end,
    (node) => node.value.height === targetHeight,
    {
      elevationDirectionReversed: true,
    }
  );
  return start.getDistanceToStart();
}

function parseInput(input: string) {
  const nodes = input
    .split('\n')
    .map((row, j) =>
      row.split('').map((value, i) => new HikeNode(i, j, value))
    );

  for (const node of nodes.flatMap((nodeRow) => nodeRow)) {
    node.nodeMap = nodes;
  }
  return nodes;
}

class HikeNode extends BfsNode<HikeLocation, HikeOptions> {
  nodeMap: HikeNode[][];

  constructor(x: number, y: number, elevationName: string) {
    super();
    this.value = {
      x,
      y,
      name: elevationName,
      height: getHeight(elevationName),
    };
  }

  getAdjacentNodes(options: HikeOptions) {
    return [this.up, this.left, this.right, this.down].filter(
      (square) =>
        square &&
        (options.elevationDirectionReversed
          ? this.height <= square.height + 1
          : square.height <= this.height + 1)
    );
  }

  // Node on left side, etc.
  get left(): HikeNode {
    return this.x === 0 ? undefined : this.nodeMap[this.y][this.x - 1];
  }
  get right(): HikeNode {
    return this.x === this.nodeMap[0].length - 1
      ? undefined
      : this.nodeMap[this.y][this.x + 1];
  }
  get up(): HikeNode {
    return this.y === 0 ? undefined : this.nodeMap[this.y - 1][this.x];
  }
  get down(): HikeNode {
    return this.y === this.nodeMap.length - 1
      ? undefined
      : this.nodeMap[this.y + 1][this.x];
  }

  get x() {
    return this.value.x;
  }

  get y() {
    return this.value.y;
  }

  get height() {
    return this.value.height;
  }
}

function getHeight(elevationName: string) {
  if (elevationName === START) {
    return 'a'.charCodeAt(0);
  }
  if (elevationName === END) {
    return 'z'.charCodeAt(0);
  }
  return elevationName.charCodeAt(0);
}
