import { BfsNode, findTargetsWithBfs } from './algorithms/bfs';
import { getAllArrayPairs } from './utils';
// https://adventofcode.com/2022/day/16

interface ValvePath {
  targetValve: Valve;
  distance: number;
}

export function part1(input: string) {
  const valves = parseInput(input);
  const startingValve = valves.find((valve) => valve.id === 'AA')!;
  const result = findMaxValvePressure(startingValve, 30);
  return result;
}

export function part2(input: string) {
  const valves = parseInput(input);
  const startingValve = valves.find((valve) => valve.id === 'AA')!;
  const flowValves = valves.filter((valve) => valve.flowRate > 0);
  const time = 26;

  const flowValveCombinations = getAllArrayPairs(flowValves);

  const pressures: number[] = [];

  // Assign valves between human/elephant handlers. Each only cares about their opened valves.
  // Go through all possible combinations
  for (const [valves1, valves2] of flowValveCombinations) {
    valves1.forEach((valve) => (valve.opened = true));
    valves2.forEach((valve) => (valve.opened = false));
    const pressure1 = findMaxValvePressure(startingValve, time);
    valves1.forEach((valve) => (valve.opened = false));
    valves2.forEach((valve) => (valve.opened = true));
    const pressure2 = findMaxValvePressure(startingValve, time);
    pressures.push(pressure1 + pressure2);
  }

  return Math.max(...pressures);
}

function parseInput(input: string) {
  const valves = input.split('\n').map(parseValve);
  for (const valve of valves) {
    // Number of valves is small, so linear search is performant enough
    valve.neighbors = valve.neighborIds.map(
      (id) => valves.find((valve) => valve.id === id)!
    );
  }
  for (const valve of valves) {
    // It could be possible to optimise this by utilising results of previous iterations,
    // but is good enough for this small of a graph
    valve.shortestPaths = getShortestFlowingValveDirections(valve, valves);
  }
  return valves;
}

function parseValve(row: string): Valve {
  const [, valveId, rate, tunnels] = row.split(
    /Valve | has flow rate=|; tunnels? leads? to valves? /g
  );
  return new Valve(valveId, +rate, tunnels.split(', '));
}

class Valve extends BfsNode<undefined, undefined> {
  neighbors: Valve[] = [];
  shortestPaths: ValvePath[] = [];
  opened: boolean;

  constructor(
    public id: string,
    public flowRate: number,
    public neighborIds: string[]
  ) {
    super();
    // No reason to open valves with no flow, so can be marked as open
    this.opened = flowRate === 0;
  }

  override getAdjacentNodes(): Valve[] {
    return this.neighbors;
  }
}

/**
 * Finds max pressure value recursively.
 * @param currentLocation Location of valve handler (human/elephant, same implementation)
 * @param targetValve     Current target to which handler is going. Null if not yet decided.
 * @param timeRemaining   Remaining time in minutes.
 * @returns
 */
function findMaxValvePressure(
  currentLocation: Valve,
  timeRemaining: number
): number {
  if (timeRemaining <= 1) {
    return 0;
  } else if (timeRemaining === 2) {
    return currentLocation.opened ? 0 : currentLocation.flowRate;
  }

  const pressures: number[] = [];

  if (!currentLocation.opened) {
    // Scenario 1: Unopen location reached => Open
    // Location stays the same to handle 1 turn delay
    currentLocation.opened = true;
    pressures.push(
      findMaxValvePressure(currentLocation, timeRemaining - 1) +
        currentLocation.flowRate * (timeRemaining - 1)
    );
    currentLocation.opened = false;
  } else {
    // Scenario 2:  Go through all possible reachable valve targets
    const nextValves = currentLocation.shortestPaths.filter(
      (path) => path.distance < timeRemaining - 2 && !path.targetValve.opened
    );
    pressures.push(
      ...nextValves.map((neighbor) =>
        findMaxValvePressure(
          neighbor.targetValve,
          timeRemaining - neighbor.distance
        )
      )
    );
  }
  return Math.max(0, ...pressures);
}

/**
 * Get shortest paths to each valve with flow with BFS
 */
function getShortestFlowingValveDirections(
  startingValve: Valve,
  valves: Valve[]
): ValvePath[] {
  const valvesWithFlow = findTargetsWithBfs(
    startingValve,
    (possibleTarget) => possibleTarget.flowRate > 0,
    undefined
  );
  const directions: ValvePath[] = [];
  for (const flowValve of valvesWithFlow) {
    if (flowValve === startingValve) {
      continue;
    }
    const path = flowValve.getPath<Valve>();
    directions.push({
      targetValve: flowValve,
      distance: path.length - 1,
    });
  }
  // Reset node states for next function call
  for (const valve of valves) {
    valve.resetNodeState();
  }
  return directions;
}
