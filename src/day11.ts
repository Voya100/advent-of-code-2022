import { multiply } from './utils';
// https://adventofcode.com/2022/day/11

type Operator = '*' | '+';

const RELIEF_DIVISION_FACTOR = 3;

export function part1(input: string) {
  const monkeys = parseInput(input);
  return getLevelOfMonkeyBusiness(monkeys, true, 20);
}

export function part2(input: string) {
  const monkeys = parseInput(input);
  return getLevelOfMonkeyBusiness(monkeys, false, 10000);
}

function getLevelOfMonkeyBusiness(
  monkeys: Monkey[],
  useReliefFactor: boolean,
  rounds: number
) {
  const moduloValue = multiply(monkeys, (monkey) => monkey.divisionValue);
  for (let i = 0; i < rounds; i++) {
    runRound(monkeys, useReliefFactor, moduloValue);
  }
  const inspectionCounters = monkeys
    .map((monkey) => monkey.inspectionCounter)
    .sort((a, b) => b - a);
  return inspectionCounters[0] * inspectionCounters[1];
}

export function parseInput(input: string) {
  return input.split('\n\n').map(parseMonkey);
}

export function parseMonkey(monkeyInput: string) {
  const regex = new RegExp(
    /Monkey (?<id>\d+):\n/.source +
      / {2}Starting items: (?<items>[0-9 ,]+)\n/.source +
      / {2}Operation: new = (?<operationValue1>\S+) (?<operator>.) (?<operationValue2>\S+)\n/
        .source +
      / {2}Test: divisible by (?<divisionValue>\d+)\n/.source +
      / {4}If true: throw to monkey (?<trueMonkeyIndex>\d+)\n/.source +
      / {4}If false: throw to monkey (?<falseMonkeyIndex>\d+)/.source
  );
  const {
    items,
    operator,
    operationValue1,
    operationValue2,
    divisionValue,
    trueMonkeyIndex,
    falseMonkeyIndex,
  } = monkeyInput.match(regex).groups;
  return new Monkey(
    items.split(', ').map((item) => +item),
    operator as Operator,
    operationValue1 === 'old' ? operationValue1 : +operationValue1,
    operationValue2 === 'old' ? operationValue2 : +operationValue2,
    +divisionValue,
    +trueMonkeyIndex,
    +falseMonkeyIndex
  );
}

export function runRound(
  monkeys: Monkey[],
  useReliefFactor: boolean,
  divisionFactor: number
) {
  for (const monkey of monkeys) {
    monkey.inspectItems(monkeys, useReliefFactor, divisionFactor);
  }
}

class Monkey {
  inspectionCounter = 0;

  constructor(
    public items: number[],
    public operator: Operator,
    public operationValue1: number | 'old',
    public operationValue2: number | 'old',
    public divisionValue: number,
    public trueMonkeyIndex: number,
    public falseMonkeyIndex: number
  ) {}

  inspectItems(
    monkeys: Monkey[],
    useReliefFactor: boolean,
    moduloValue: number
  ) {
    for (const item of this.items) {
      this.inspectItem(monkeys, useReliefFactor, moduloValue, item);
    }
    this.items = [];
  }

  inspectItem(
    monkeys: Monkey[],
    useReliefFactor: boolean,
    moduloValue: number,
    item: number
  ) {
    let itemValue = item;
    const operationValue1 =
      this.operationValue1 === 'old' ? item : this.operationValue1;
    const operationValue2 =
      this.operationValue2 === 'old' ? item : this.operationValue2;
    switch (this.operator) {
      case '*':
        itemValue = operationValue1 * operationValue2;
        break;
      case '+':
        itemValue = operationValue1 + operationValue2;
        break;
      default:
        throw new Error(`Unknown operator: '${this.operator}'`);
    }
    if (useReliefFactor) {
      itemValue = Math.floor(itemValue / RELIEF_DIVISION_FACTOR);
    }
    // Reduce itemValue size by taking modulo of multiplied factors, so that it does not reach Infinity
    itemValue %= moduloValue;
    if (itemValue % this.divisionValue === 0) {
      monkeys[this.trueMonkeyIndex].items.push(itemValue);
    } else {
      monkeys[this.falseMonkeyIndex].items.push(itemValue);
    }
    this.inspectionCounter++;
  }
}
