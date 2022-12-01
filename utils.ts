export function sum<T>(
  objects: T[],
  valueFunction: (object: T, index?: number) => number
) {
  return objects.reduce(
    (sum, object, index) => sum + valueFunction(object, index),
    0
  );
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
  for (let value of values) {
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
    return (values[values.length / 2 - 1] + values[values.length / 2]) / 2
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

export class ExtendedSet<T> extends Set<T> {

  constructor(iterable?: Iterable<T>) {
    super(iterable)
  }

  intersect(iterable?: Iterable<T>) {
    const newSet = new ExtendedSet<T>();
    for (let value of iterable) {
      if (this.has(value)) {
        newSet.add(value)
      }
    }
    return newSet;
  }

  difference(iterable?: Iterable<T>) {
    const newSet = new ExtendedSet(this);
    for (let value of iterable) {
      newSet.delete(value);
    }
    return newSet;
  }

  union(iterable?: Iterable<T>) {
    const newSet = new ExtendedSet(this);
    for (let value of iterable) {
      newSet.add(value);
    }
    return newSet;
  }

  getFistValue() {
    return this.values().next().value as T;
  }

}

class HeapItem<T> {
  constructor(public object: T, public value: number) { }
}

export class MinHeap<T> {
  items: HeapItem<T>[] = [];

  constructor(private valueFunction: (object: T) => number) { }

  addItem(item: T) {
    this.items.push(new HeapItem(item, this.valueFunction(item)));
    for (let i = Math.floor(this.items.length / 2); i >= 0; i--) {
      this.heapify(i);
    }
  }

  addItems(items: T[]) {
    for (let item of items) {
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

  private heapify(index: number = 0) {
    const left = 2 * index + 1;
    const right = 2 * (index + 1);
    let smallest = index;
    if (left < this.items.length && this.items[left].value < this.items[smallest].value) {
      smallest = left;
    }
    if (right < this.items.length && this.items[right].value < this.items[smallest].value) {
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