// https://adventofcode.com/2022/day/8

export function part1(input: string) {
  const heights = parseInput(input);
  const topVisible = getVisibleCoordinates(heights, 'up');
  const bottomVisible = getVisibleCoordinates(heights, 'down');
  const leftVisible = getVisibleCoordinates(heights, 'left');
  const rightVisible = getVisibleCoordinates(heights, 'right');
  // Count distinct trees
  return new Set([
    ...topVisible,
    ...bottomVisible,
    ...leftVisible,
    ...rightVisible,
  ]).size;
}

export function part2(input: string) {
  const heights = parseInput(input);
  return Math.max(
    ...heights.flatMap((row, j) =>
      row.map((_, i) => getScenicScore(heights, i, j))
    )
  );
}

function parseInput(input: string) {
  return input.split('\n').map((row) => row.split('').map((num) => +num));
}

function getVisibleCoordinates(
  input: number[][],
  direction: 'up' | 'down' | 'left' | 'right'
) {
  const visibleCoordinates: string[] = [];
  const iIterSize =
    direction === 'up' || direction === 'down' ? input.length : input[0].length;
  const jIterSize =
    direction === 'up' || direction === 'down' ? input[0].length : input.length;
  for (let j = 0; j < jIterSize; j++) {
    let maxHeight = -1;
    for (let i = 0; i < iIterSize; i++) {
      let x = i;
      let y = j;
      if (direction === 'left') {
        x = iIterSize - i - 1;
        y = j;
      } else if (direction === 'down') {
        x = j;
        y = i;
      } else if (direction === 'up') {
        x = j;
        y = iIterSize - i - 1;
      }
      const value = input[y][x];
      if (value > maxHeight) {
        visibleCoordinates.push(`${x},${y}`);
      }
      maxHeight = Math.max(maxHeight, value);
    }
  }
  return visibleCoordinates;
}

/**
 * Calculate visibility in each direction (left, up, right, down) and multiply obtained values
 */
function getScenicScore(trees: number[][], x: number, y: number) {
  const treeHeight = trees[y][x];

  // Right trees
  let rightVisibility = 0;
  for (let i = x + 1; i < trees[y].length; i++) {
    rightVisibility += 1;
    if (trees[y][i] >= treeHeight) {
      break;
    }
  }
  // Left trees
  let leftVisibility = 0;
  for (let i = x - 1; i >= 0; i--) {
    leftVisibility += 1;
    if (trees[y][i] >= treeHeight) {
      break;
    }
  }

  // Bottom trees
  let bottomVisibility = 0;
  for (let i = y + 1; i < trees.length; i++) {
    bottomVisibility += 1;
    if (trees[i][x] >= treeHeight) {
      break;
    }
  }
  // Top trees
  let topVisibility = 0;
  for (let i = y - 1; i >= 0; i--) {
    topVisibility += 1;
    if (trees[i][x] >= treeHeight) {
      break;
    }
  }
  return rightVisibility * leftVisibility * bottomVisibility * topVisibility;
}
