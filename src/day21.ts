// https://adventofcode.com/2022/day/21

import { toMap } from './utils';

type Operator = '+' | '-' | '*' | '/';

interface ValueMonkey {
  name: string;
  value: number | null;
}

interface OperatorMonkey {
  name: string;
  operator: Operator;
  operationMonkey1: string;
  operationMonkey2: string;
}

type Monkey = ValueMonkey | OperatorMonkey;

const HUMAN_NAME = 'humn';
const ROOT_NAME = 'root';

export function part1(input: string) {
  const monkeys = parseInput(input);
  const monkeyMap = toMap(monkeys, (monkey) => monkey.name);
  return resolveValue(monkeyMap.get(ROOT_NAME)!, monkeyMap);
}

export function part2(input: string) {
  const monkeys = parseInput(input);
  const monkeyMap = toMap(monkeys, (monkey) => monkey.name);

  const human = monkeyMap.get(HUMAN_NAME)!;
  (human as ValueMonkey).value = null;

  const root = monkeyMap.get(ROOT_NAME) as OperatorMonkey;
  const monkey1 = monkeyMap.get(root.operationMonkey1)!;
  const monkey2 = monkeyMap.get(root.operationMonkey2)!;
  const value1 = resolveValue(monkey1, monkeyMap);
  const value2 = resolveValue(monkey2, monkeyMap);

  if (value1 === null) {
    return resolveHumanValue(monkey1, monkeyMap, value2!);
  }
  if (value2 === null) {
    return resolveHumanValue(monkey2, monkeyMap, value1!);
  }
  throw new Error('Value found');
}

function parseInput(input: string) {
  return input.split('\n').map(parseMonkey);
}

function parseMonkey(row: string): Monkey {
  const [nameInput, name1OrValue, operator, name2] = row.split(' ');
  // Remove ":"
  const name = nameInput.slice(0, nameInput.length - 1);
  if (operator) {
    return {
      name,
      operator: operator as Operator,
      operationMonkey1: name1OrValue,
      operationMonkey2: name2,
    };
  }
  return {
    name,
    value: +name1OrValue,
  };
}

function resolveValue(
  monkey: Monkey,
  monkeys: Map<string, Monkey>
): number | null {
  if ('value' in monkey) {
    return monkey.value;
  }
  const value1 = resolveValue(monkeys.get(monkey.operationMonkey1)!, monkeys);
  if (value1 === null) {
    return null;
  }
  const value2 = resolveValue(monkeys.get(monkey.operationMonkey2)!, monkeys);
  if (value2 === null) {
    return null;
  }
  switch (monkey.operator) {
    case '+':
      return value1 + value2;
    case '-':
      return value1 - value2;
    case '*':
      return value1 * value2;
    case '/':
      return value1 / value2;
    default:
      throw new Error(`Unknown operator: ${monkey.operator}`);
  }
}

/**
 * Recursively resolves one half of operation,
 * determines the wanted result of the other half based on first half's result,
 * and then repeats the process for the "unknown" half until the unknown human value is reached.
 *
 * Assumes that the unknown human value is always on only one side of the operation.
 */
function resolveHumanValue(
  monkey: Monkey,
  monkeys: Map<string, Monkey>,
  wantedOutput: number
): number | null {
  if (monkey.name === HUMAN_NAME) {
    return wantedOutput;
  }
  if (!('operator' in monkey)) {
    throw new Error('Expected operator monkey');
  }
  const monkey1 = monkeys.get(monkey.operationMonkey1)!;
  const monkey2 = monkeys.get(monkey.operationMonkey2)!;
  const value1 = resolveValue(monkey1, monkeys);
  const value2 = resolveValue(monkey2, monkeys);
  if (value1 === null) {
    const missingValue = resolveMissingOperationValue(
      value1,
      value2,
      monkey.operator,
      wantedOutput!
    );
    return resolveHumanValue(monkey1, monkeys, missingValue);
  }
  if (value2 === null) {
    const missingValue = resolveMissingOperationValue(
      value1,
      value2,
      monkey.operator,
      wantedOutput!
    );
    return resolveHumanValue(monkey2, monkeys, missingValue);
  }
  throw new Error('Expected one of the values to be missing');
}

function resolveMissingOperationValue(
  value1: number | null,
  value2: number | null,
  operator: Operator,
  output: number
) {
  if (value1 === null) {
    switch (operator) {
      case '+':
        return output - value2!;
      case '-':
        return output + value2!;
      case '*':
        return output / value2!;
      case '/':
        return output * value2!;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  if (value2 === null) {
    switch (operator) {
      case '+':
        return output - value1;
      case '-':
        return value1 - output;
      case '*':
        return output / value1;
      case '/':
        return output * value1;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }
  throw new Error('Both values unknown');
}
