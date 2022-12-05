import { getRange } from './utils';
// https://adventofcode.com/2022/day/5

interface Command {
  itemCount: number;
  from: number;
  to: number;
}

export function part1(input: string) {
  return getResult(input, processCommand9000);
}

export function part2(input: string) {
  return getResult(input, processCommand9001);
}

function getResult(
  input: string,
  processCommand: (stacks: string[][], command: Command) => void
) {
  const { stacks, commands } = parseInput(input);
  for (const command of commands) {
    processCommand(stacks, command);
  }
  return stacks.map((stack) => stack[stack.length - 1] || ' ').join('');
}

function parseInput(input: string) {
  const [stackInput, commandInput] = input.split('\n\n');
  return {
    stacks: parseStackInput(stackInput),
    commands: parseCommandInput(commandInput),
  };
}

/**
 * Parses stack input by assuming that input os in format
 * [A] [B]     [D]
 * [E]     [F] [G]
 *  1   2   3   4
 * In which each box is separated by 1 space.
 * It is also assumed that there is trailing space up to the rightmost column's box on each row if
 * rightmost stack is not full.
 */
function parseStackInput(stackInput: string) {
  // Remove last row and reverse order
  const stackRows = stackInput.split('\n');
  stackRows.pop();
  stackRows.reverse();
  // Create right amount of stacks based on first row
  const stackCount = (stackRows[0].length + 1) / 4;
  const stacks = getRange(0, stackCount).map(() => []);
  for (const row of stackRows) {
    for (let i = 0; i < stackCount; i++) {
      const item = row[1 + i * 4];
      if (item !== ' ') {
        stacks[i].push(item);
      }
    }
  }
  return stacks;
}

function parseCommandInput(commandInput: string) {
  return commandInput.split('\n').map(parseCommand);
}

/**
 * Parses command from following format:
 * move 1 from 2 to 3
 */
function parseCommand(row: string): Command {
  const [, itemCount, , from, , to] = row.split(' ');
  return {
    itemCount: +itemCount,
    from: +from,
    to: +to,
  };
}

function processCommand9000(stacks: string[][], command: Command) {
  const fromStack = stacks[command.from - 1];
  const toStack = stacks[command.to - 1];
  toStack.push(...fromStack.splice(-command.itemCount).reverse());
}

function processCommand9001(stacks: string[][], command: Command) {
  const fromStack = stacks[command.from - 1];
  const toStack = stacks[command.to - 1];
  toStack.push(...fromStack.splice(-command.itemCount));
}
