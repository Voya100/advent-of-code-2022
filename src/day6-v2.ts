// https://adventofcode.com/2022/day/6

export function part1(input: string) {
  return findDistinctCharMarker(input, 4);
}

export function part2(input: string) {
  return findDistinctCharMarker(input, 14);
}

/**
 * Slightly more complicated, but more optimised solution for day 6
 * Old version: ~1,3 ms for full input (part 2)
 * New version: ~0,13 ms for full input (part 2)
 */
function findDistinctCharMarker(input: string, markerSize: number) {
  for (let i = markerSize; i < input.length; i++) {
    const distinctChars = new Set<string>();
    let distinctSize = 0;
    // Iterate from end of possible marker
    for (let j = i - 1; j >= i - markerSize - 1; j--) {
      distinctChars.add(input[j]);
      if (distinctChars.size === distinctSize) {
        // Duplicate character => move iterator i before the next possible marker end position
        i = j + markerSize;
        break;
      }
      distinctSize = distinctChars.size;
    }
    if (distinctChars.size === markerSize) {
      return i + 1;
    }
  }
  return null;
}
