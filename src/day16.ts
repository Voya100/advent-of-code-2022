// https://adventofcode.com/2022/day/16

interface Valve {
  id: string;
  flowRate: number;
  neighborIds: string[];
  neighbors: Valve[];
}

export function part1(input: string) {
  const valves = parseInput(input);
  const startingValve = valves.find((valve) => valve.id === 'AA');
  const result = findMaxValvePressure(startingValve, new Set(), new Set(), 30);
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
  };
}

function findMaxValvePressure(
  valve: Valve,
  openedValves: Set<Valve>,
  skippedValves: Set<Valve>,
  timeRemaining: number
): number {
  if (timeRemaining <= 1) {
    return 0;
  } else if (timeRemaining === 2) {
    return openedValves.has(valve) ? 0 : valve.flowRate;
  }
  const nextValves = valve.neighbors.filter(
    (neighbor) => !skippedValves.has(neighbor)
  );
  // Scenario 1: Skip current valve
  skippedValves.add(valve);
  const pressureValues1 = nextValves.map((neighbor) =>
    findMaxValvePressure(
      neighbor,
      openedValves,
      skippedValves,
      timeRemaining - 1
    )
  );
  skippedValves.delete(valve);
  let pressureValues2: number[] = [];
  if (valve.flowRate && !openedValves.has(valve)) {
    // Scenario 2: Open current valve
    openedValves.add(valve);
    pressureValues2 = valve.neighbors.map(
      (neighbor) =>
        // Reset skipped valves after opening the valve, since it's possible to return
        findMaxValvePressure(
          neighbor,
          openedValves,
          new Set(),
          timeRemaining - 2
        ) +
        valve.flowRate * (timeRemaining - 1)
    );
    openedValves.delete(valve);
  }
  return Math.max(...pressureValues1, ...pressureValues2);
}
