export function sum<T>(
  objects: T[],
  valueFunction: (object: T, index?: number) => number
): number {
  return objects.reduce(
    (sum, object, index) => sum + valueFunction(object, index),
    0
  );
}

export function numberSum(numbers: number[]) {
  return numbers.reduce((sum, object) => sum + object, 0);
}

export function multiply<T>(
  objects: T[],
  valueFunction: (object: T) => number
) {
  return objects.reduce((result, object) => result * valueFunction(object), 1);
}

export function min<T>(objects: T[], valueFunction: (object: T) => number) {
  return objects.reduce(
    (minObject, object) =>
      valueFunction(minObject) <= valueFunction(object) ? minObject : object,
    objects[0]
  );
}

export function max<T>(objects: T[], valueFunction: (object: T) => number) {
  return objects.reduce(
    (maxObject, object) =>
      valueFunction(maxObject) >= valueFunction(object) ? maxObject : object,
    objects[0]
  );
}

export function toCountMap<T>(values: T[]): Map<T, number> {
  const map = new Map();
  for (const value of values) {
    const count = map.get(value);
    if (count) {
      map.set(value, count + 1);
    } else {
      map.set(value, 1);
    }
  }
  return map;
}

export function median(values: number[]) {
  if (values.length % 2 === 0) {
    return (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
  }
  return values[Math.floor(values.length / 2)];
}

export function getRange(start: number, end: number) {
  const numbers: number[] = [];
  for (let i = start; i < end; i++) {
    numbers.push(i);
  }
  return numbers;
}

export function partition<T>(values: T[], listSize: number): T[][] {
  const partitionedValues = [];
  for (let i = 0; i < values.length; i += listSize) {
    partitionedValues.push(values.slice(i, i + listSize));
  }

  return partitionedValues;
}

export function getCombinations<T>(values: T[]): T[][] {
  if (values.length === 1) {
    return [values];
  }
  const subCombinations = getCombinations(values.slice(1));
  subCombinations.push(
    ...subCombinations.map((subCombination) => [values[0], ...subCombination])
  );
  subCombinations.push([values[0]]);

  return subCombinations;
}

/**
 * Split array into all possible split combinations
 * Example: [1,2,3] => [[1,2,3],[]], [[2,3],[1]], [[1,3],[2]], [[3],[1,2]]
 */
export function getAllArrayPairs<T>(values: T[]): [T[], T[]][] {
  if (values.length === 1) {
    return [[values, []]];
  }
  const subPairs = getAllArrayPairs(values.slice(1));
  return subPairs.flatMap(([array1, array2]) => [
    [[values[0], ...array1], array2],
    [array1, [values[0], ...array2]],
  ]);
}

/**
 * Finds repeating number patterns by comparing differences of values of different pattern intervals.
 * Sequential values of minLength-maxLength have same value difference as matching values in next [minPatterncount]
 * patterns, it is a pattern.
 * Example pattern of length 3: 1,3,6,  7,9,12  13,15,18
 * (13-7=7-1, 15-9=9-3, 18-12=12-6)
 * @param values          Number values from whih to find the pattern
 * @param minLength       Minimum length of pattern
 * @param maxLength       Maximum length of pattern
 * @param minPatternCount How often pattern must occur sequentially
 * @returns
 */
export function findPattern(
  values: number[],
  minLength = 250,
  maxLength = 2500,
  minPatternCount = 10
) {
  if (values.length < maxLength * (minPatternCount + 1)) {
    return;
  }
  for (
    let patternLength = minLength;
    patternLength <= maxLength;
    patternLength++
  ) {
    const patternResult = hasPattern(values, patternLength, minPatternCount);
    if (patternResult) {
      return patternResult;
    }
  }
  return null;
}

function hasPattern(
  values: number[],
  patternLength: number,
  patternCount: number
) {
  const start = values.length - patternLength * patternCount;
  for (let i = 0; i < patternLength; i++) {
    let previousValue = values[start + i];
    let previousDiff: number | null = null;
    for (let patternIndex = 1; patternIndex < patternCount; patternIndex++) {
      const patternValue = values[start + i + patternIndex * patternLength];
      const diff = patternValue - previousValue;
      if (!previousDiff) {
        previousDiff = diff;
      } else if (previousDiff !== diff) {
        return null;
      }
      previousValue = patternValue;
    }
  }
  return { patternLength };
}

export class ExtendedSet<T> extends Set<T> {
  constructor(iterable?: Iterable<T>) {
    super(iterable);
  }

  intersect(iterable: Iterable<T>) {
    const newSet = new ExtendedSet<T>();
    for (const value of iterable) {
      if (this.has(value)) {
        newSet.add(value);
      }
    }
    return newSet;
  }

  intersectAll(iterables: Iterable<T>[]) {
    let newSet = this.intersect(iterables[0]);
    for (const iterable of iterables.slice(1)) {
      newSet = newSet.intersect(iterable);
    }
    return newSet;
  }

  difference(iterable: Iterable<T>) {
    const newSet = new ExtendedSet(this);
    for (const value of iterable) {
      newSet.delete(value);
    }
    return newSet;
  }

  union(iterable: Iterable<T>) {
    const newSet = new ExtendedSet(this);
    for (const value of iterable) {
      newSet.add(value);
    }
    return newSet;
  }

  getFistValue() {
    return this.values().next().value as T;
  }
}

class HeapItem<T> {
  constructor(public object: T, public value: number) {}
}

export class MinHeap<T> {
  items: HeapItem<T>[] = [];

  constructor(private valueFunction: (object: T) => number) {}

  addItem(item: T) {
    this.items.push(new HeapItem(item, this.valueFunction(item)));
    for (let i = Math.floor(this.items.length / 2); i >= 0; i--) {
      this.heapify(i);
    }
  }

  addItems(items: T[]) {
    for (const item of items) {
      this.items.push(new HeapItem(item, this.valueFunction(item)));
    }
    for (let i = Math.floor(this.items.length / 2); i >= 0; i--) {
      this.heapify(i);
    }
  }

  pop() {
    const item = this.items[0];
    this.swap(0, this.items.length - 1);
    this.items.pop();
    this.heapify(0);
    return item.object;
  }

  private heapify(index = 0) {
    const left = 2 * index + 1;
    const right = 2 * (index + 1);
    let smallest = index;
    if (
      left < this.items.length &&
      this.items[left].value < this.items[smallest].value
    ) {
      smallest = left;
    }
    if (
      right < this.items.length &&
      this.items[right].value < this.items[smallest].value
    ) {
      smallest = right;
    }
    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapify(smallest);
    }
  }

  private swap(index1: number, index2: number) {
    const value1 = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = value1;
  }

  get length() {
    return this.items.length;
  }
}
