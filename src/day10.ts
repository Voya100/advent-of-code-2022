import { numberSum, partition } from './utils';
// https://adventofcode.com/2022/day/10

enum InstructionType {
  Noop = 'noop',
  Addx = 'addx',
}

interface Instruction {
  type: InstructionType;
  input: number;
}

const ROW_LENGTH = 40;

export function part1(input: string) {
  const instructions = parseInput(input);
  const cycleValues = runInstructions(instructions);
  const signalIndices = [19, 59, 99, 139, 179, 219];
  const signalScores = cycleValues
    .map((value, i) => value * (i + 1))
    .filter((_, i) => signalIndices.includes(i));
  return numberSum(signalScores);
}

export function part2(input: string) {
  const instructions = parseInput(input);
  const cycleValues = runInstructions(instructions);
  return '\n' + renderCrtScreen(cycleValues);
}

export function parseInput(input: string): Instruction[] {
  return input.split('\n').map((row) => {
    const [type, instructionInput] = row.split(' ');
    return {
      type: type as InstructionType,
      input: +instructionInput,
    };
  });
}

export function runInstructions(instructions: Instruction[]) {
  const cycleValues = [];
  let xValue = 1;
  for (const instruction of instructions) {
    cycleValues.push(xValue);
    switch (instruction.type) {
      case InstructionType.Addx:
        // Skip a cycle
        cycleValues.push(xValue);
        xValue += instruction.input;
        break;
      case InstructionType.Noop:
        break;
      default:
        throw new Error(`Unknown type: ${instruction.type}`);
    }
  }
  return cycleValues;
}

function renderCrtScreen(cycleValues: number[]) {
  const pixels = cycleValues.map((value, index) => renderPixel(value, index));
  return partition(pixels, ROW_LENGTH)
    .map((row) => row.join(''))
    .join('\n');
}

function renderPixel(cycleValue: number, cycleIndex: number) {
  // Using space instead of '.' to make image easier to read
  return Math.abs((cycleIndex % ROW_LENGTH) - cycleValue) <= 1 ? '#' : ' ';
}
