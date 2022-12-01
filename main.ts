#!/usr/bin/env -S node -r "ts-node/register"

import * as fs from "fs";

async function main() {
  if (process.argv.length <= 2) {
    console.log('Usage: ./main.ts [dayNumber, 1-25]\nExample: ./main.ts 1');
    return;
  }

  const day = Number.parseInt(process.argv[2]);

  if (isNaN(day)) {
    console.error(`Invalid date: ${process.argv[2]}`);
    return;
  }

  if (day < 1 || day > 25) {
    console.error('Day must be between 1-25.');
    return;
  }

  let input: string;

  try {
    input = fs.readFileSync(`inputs/day${day}.txt`, "utf8");
  } catch (error) {
    console.warn("Day's input file is missing");
    return;
  }

  // Not most ideal from type security standpoint, but good enough for this use case
  const module = await import(`./src/day${day}`);
  const part1 = module[`day${day}Part1`];
  const part2 = module[`day${day}Part2`];

  console.log(`Day ${day}`);
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}

main();