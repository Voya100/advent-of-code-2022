// https://adventofcode.com/2022/day/16

interface Valve {
  id: string;
  flowRate: number;
  neighborIds: string[];
  neighbors: Valve[];
  opened: boolean;
}

interface CachedResult {
  resultsByTimeRemaining: Record<number, number>;
  highestTimeRemaining: number;
}

export function part1(input: string) {
  const valves = parseInput(input);
  const startingValve = valves.find((valve) => valve.id === 'AA');
  const cachedValues: Record<string, CachedResult> = {};
  const result = findMaxValvePressure(
    startingValve,
    valves,
    new Set(),
    30,
    cachedValues
  );
  return result;
}

export function part2(input: string) {
  const v = parseInput(input);
  return 'TODO';
}

function parseInput(input: string) {
  const valves = input.split('\n').map(parseValve);
  for (const valve of valves) {
    // Number of valves is small, so linear search is performant enough
    valve.neighbors = valve.neighborIds.map((id) =>
      valves.find((valve) => valve.id === id)
    );
  }
  return valves;
}

function parseValve(row: string): Valve {
  const [, valveId, rate, tunnels] = row.split(
    /Valve | has flow rate=|; tunnels? leads? to valves? /g
  );
  return {
    id: valveId,
    flowRate: +rate,
    neighborIds: tunnels.split(', '),
    neighbors: [],
    // No reason to open valves with no flow, so can be marked as open
    opened: +rate === 0,
  };
}

function findMaxValvePressure(
  valve: Valve,
  valves: Valve[],
  skippedValves: Set<Valve>,
  timeRemaining: number,
  cachedValues: Record<string, CachedResult>
): number {
  iterCount++;
  if (timeRemaining <= 1) {
    return 0;
  } else if (timeRemaining === 2) {
    return valve.opened ? 0 : valve.flowRate;
  }
  const cacheKey = getCacheKey(valve, valves);
  const cachedValue = cachedValues[cacheKey];
  if (cachedValue && cachedValue.resultsByTimeRemaining[timeRemaining]) {
    // Already processed this state => Return cached result
    return cachedValue.resultsByTimeRemaining[timeRemaining];
  } else if (cachedValue && cachedValue.highestTimeRemaining > timeRemaining) {
    // Has reached this state before in quicker time => not the highest result
    return 0;
  }
  const nextValves = valve.neighbors.filter(
    (neighbor) => !skippedValves.has(neighbor)
  );
  // Scenario 1: Skip current valve
  skippedValves.add(valve);
  const pressureValues1 = nextValves.map((neighbor) =>
    findMaxValvePressure(
      neighbor,
      valves,
      skippedValves,
      timeRemaining - 1,
      cachedValues
    )
  );
  skippedValves.delete(valve);
  let pressureValues2: number[] = [];
  if (!valve.opened) {
    // Scenario 2: Open current valve
    valve.opened = true;
    pressureValues2 = valve.neighbors.map(
      (neighbor) =>
        // Reset skipped valves after opening the valve, since it's possible to return
        findMaxValvePressure(
          neighbor,
          valves,
          new Set(),
          timeRemaining - 2,
          cachedValues
        ) +
        valve.flowRate * (timeRemaining - 1)
    );
    valve.opened = false;
  }
  const maxPressure = Math.max(...pressureValues1, ...pressureValues2);
  if (cachedValue) {
    cachedValue.resultsByTimeRemaining[timeRemaining] = maxPressure;
    if (cachedValue.highestTimeRemaining < timeRemaining) {
      cachedValue.highestTimeRemaining = timeRemaining;
    }
  } else {
    cachedValues[cacheKey] = {
      resultsByTimeRemaining: {
        [timeRemaining]: maxPressure,
      },
      highestTimeRemaining: timeRemaining,
    };
  }
  return maxPressure;
}

function getCacheKey(valve: Valve, valves: Valve[]) {
  return valve.id + '_' + valves.map((valve) => +valve.opened).join('');
}
