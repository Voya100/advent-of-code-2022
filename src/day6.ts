// https://adventofcode.com/2022/day/6

export function part1(input: string) {
  return findDistinctCharMarker(input, 4);
}

export function part2(input: string) {
  return findDistinctCharMarker(input, 14);
}

function findDistinctCharMarker(input: string, markerSize: number) {
  for (let i = markerSize; i <= input.length; i++) {
    const distinctChars = new Set(input.slice(i - markerSize, i));
    if (distinctChars.size === markerSize) {
      return i;
    } else {
      // Optimisation: If there are multiple duplicates, the marker won't be found in next X chars,
      // where X is number of duplicates
      i += markerSize - distinctChars.size - 1;
    }
  }
  return null;
}
