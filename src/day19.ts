// https://adventofcode.com/2022/day/19

import { multiply, sum } from './utils';

interface Blueprint {
  id: number;
  oreRobot: {
    oreCost: number;
  };
  clayRobot: {
    oreCost: number;
  };
  obsidianRobot: {
    oreCost: number;
    clayCost: number;
  };
  geodeRobot: {
    oreCost: number;
    obsidianCost: number;
  };
}

interface Inventory {
  ores: number;
  clay: number;
  obsidian: number;
  geodes: number;
  oreRobots: number;
  clayRobots: number;
  obsidianRobots: number;
  geodeRobots: number;
}

export function part1(input: string) {
  const blueprints = parseInput(input);
  return sum(blueprints, (blueprint) => getQualityLevel(blueprint, 24));
}

export function part2(input: string) {
  const blueprints = parseInput(input).slice(0, 3);
  return multiply(blueprints, (blueprint) => getBestGeodeValue(blueprint, 32));
}

function parseInput(input: string) {
  return input.split('\n').map(parseBlueprint);
}

function parseBlueprint(blueprintInput: string): Blueprint {
  const [
    id,
    oreRobotOreCost,
    clayRobotOreCost,
    obsidianRobotOreCost,
    obsidianRobotClayCot,
    geodeRobotOreCost,
    geodeRobotObsidianCost,
  ] = blueprintInput.matchAll(/\d+/g);
  return {
    id: +id,
    oreRobot: {
      oreCost: +oreRobotOreCost,
    },
    clayRobot: {
      oreCost: +clayRobotOreCost,
    },
    obsidianRobot: {
      oreCost: +obsidianRobotOreCost,
      clayCost: +obsidianRobotClayCot,
    },
    geodeRobot: {
      oreCost: +geodeRobotOreCost,
      obsidianCost: +geodeRobotObsidianCost,
    },
  };
}

function getQualityLevel(blueprint: Blueprint, duration: number) {
  return blueprint.id * getBestGeodeValue(blueprint, duration);
}

function getBestGeodeValue(blueprint: Blueprint, duration: number) {
  const inventory: Inventory = {
    ores: 0,
    clay: 0,
    obsidian: 0,
    geodes: 0,
    oreRobots: 1,
    clayRobots: 0,
    obsidianRobots: 0,
    geodeRobots: 0,
  };
  const maxOreRobots = Math.max(
    blueprint.oreRobot.oreCost,
    blueprint.clayRobot.oreCost,
    blueprint.obsidianRobot.oreCost,
    blueprint.geodeRobot.oreCost
  );
  const maxClayRobots = blueprint.obsidianRobot.clayCost;
  const maxObsidianRobots = blueprint.geodeRobot.obsidianCost;
  const bestInventory = getBestInventory(
    blueprint,
    inventory,
    maxOreRobots,
    maxClayRobots,
    maxObsidianRobots,
    duration
  );
  return bestInventory.geodes;
}

function getBestInventory(
  blueprint: Blueprint,
  inventory: Inventory,
  maxOreRobots: number,
  maxClayRobots: number,
  maxObsidianRobots: number,
  timeRemaining: number,
  timeJump = 1, //= 1,
  nextRobot: 'ore' | 'clay' | 'obsidian' | 'geode' | null = null
): Inventory {
  const nextInventory = {
    ...inventory,
    ores: inventory.ores + inventory.oreRobots * timeJump,
    clay: inventory.clay + inventory.clayRobots * timeJump,
    obsidian: inventory.obsidian + inventory.obsidianRobots * timeJump,
    geodes: inventory.geodes + inventory.geodeRobots * timeJump,
  };
  if (timeRemaining < 0) {
    // Should not happen
    throw new Error('Negative time');
  }
  if (timeRemaining <= 0) {
    // Hanle off-by one round
    nextInventory.ores -= inventory.oreRobots;
    nextInventory.clay -= inventory.clayRobots;
    nextInventory.obsidian -= inventory.obsidianRobots;
    nextInventory.geodes -= inventory.geodeRobots;
    return nextInventory;
  }
  switch (nextRobot) {
    case 'ore':
      nextInventory.oreRobots++;
      nextInventory.ores -= blueprint.oreRobot.oreCost;
      break;
    case 'clay':
      nextInventory.clayRobots++;
      nextInventory.ores -= blueprint.clayRobot.oreCost;
      break;
    case 'obsidian':
      nextInventory.obsidianRobots++;
      nextInventory.ores -= blueprint.obsidianRobot.oreCost;
      nextInventory.clay -= blueprint.obsidianRobot.clayCost;
      break;
    case 'geode':
      nextInventory.geodeRobots++;
      nextInventory.ores -= blueprint.geodeRobot.oreCost;
      nextInventory.obsidian -= blueprint.geodeRobot.obsidianCost;
      break;
  }

  const stepsToOreRobot = getSteps(
    blueprint.oreRobot.oreCost,
    nextInventory.ores,
    nextInventory.oreRobots
  );
  const stepsToClayRobot = getSteps(
    blueprint.clayRobot.oreCost,
    nextInventory.ores,
    nextInventory.oreRobots
  );
  const stepsToObsidianRobot = getSteps(
    blueprint.obsidianRobot.oreCost,
    nextInventory.ores,
    nextInventory.oreRobots,
    blueprint.obsidianRobot.clayCost,
    nextInventory.clay,
    nextInventory.clayRobots
  );
  const stepsToGeodeRobot = getSteps(
    blueprint.geodeRobot.oreCost,
    nextInventory.ores,
    nextInventory.oreRobots,
    blueprint.geodeRobot.obsidianCost,
    nextInventory.obsidian,
    nextInventory.obsidianRobots
  );

  const neededClay =
    (maxObsidianRobots - inventory.obsidianRobots) *
    blueprint.obsidianRobot.clayCost;

  // Hacky optimisation: If robot type is created, assume that robots from 2 dependencies ago
  // no longer need to be created (e.g. optimised solution has already prioritised them first).
  // Works for all tested inputs, but might not work for some edge cases.
  if (inventory.geodeRobots || neededClay < nextInventory.clay) {
    maxClayRobots = nextInventory.clayRobots;
  }
  if (inventory.obsidianRobots) {
    maxOreRobots = nextInventory.oreRobots;
  }

  let bestInventory: Inventory | null = nextInventory;
  if (
    stepsToOreRobot <= timeRemaining &&
    nextInventory.oreRobots < maxOreRobots
  ) {
    const inventoryResult = getBestInventory(
      blueprint,
      nextInventory,
      maxOreRobots,
      maxClayRobots,
      maxObsidianRobots,
      timeRemaining - stepsToOreRobot,
      stepsToOreRobot,
      'ore'
    );
    if (!bestInventory || inventoryResult.geodes > bestInventory.geodes) {
      bestInventory = inventoryResult;
    }
  }

  if (
    stepsToClayRobot <= timeRemaining &&
    nextInventory.clayRobots < maxClayRobots
  ) {
    const inventoryResult = getBestInventory(
      blueprint,
      nextInventory,
      maxOreRobots,
      maxClayRobots,
      maxObsidianRobots,
      timeRemaining - stepsToClayRobot,
      stepsToClayRobot,
      'clay'
    );
    if (!bestInventory || inventoryResult.geodes > bestInventory.geodes) {
      bestInventory = inventoryResult;
    }
  }

  if (
    stepsToObsidianRobot <= timeRemaining &&
    nextInventory.obsidianRobots < maxObsidianRobots
  ) {
    const inventoryResult = getBestInventory(
      blueprint,
      nextInventory,
      maxOreRobots,
      maxClayRobots,
      maxObsidianRobots,
      timeRemaining - stepsToObsidianRobot,
      stepsToObsidianRobot,
      'obsidian'
    );
    if (!bestInventory || inventoryResult.geodes > bestInventory.geodes) {
      bestInventory = inventoryResult;
    }
  }

  if (stepsToGeodeRobot <= timeRemaining) {
    const inventoryResult = getBestInventory(
      blueprint,
      nextInventory,
      maxOreRobots,
      maxClayRobots,
      maxObsidianRobots,
      timeRemaining - stepsToGeodeRobot,
      stepsToGeodeRobot,
      'geode'
    );
    if (!bestInventory || inventoryResult.geodes > bestInventory.geodes) {
      bestInventory = inventoryResult;
    }
  }

  if (bestInventory === nextInventory) {
    nextInventory.geodes += (timeRemaining - 1) * nextInventory.geodeRobots;
    return nextInventory;
  }

  return bestInventory!;
}

function getSteps(cost1: number, amount1: number, roboutCount1: number): number;
function getSteps(
  cost1: number,
  amount1: number,
  roboutCount1: number,
  cost2: number,
  amount2: number,
  robotCount2: number
): number;
function getSteps(
  cost1: number,
  amount1: number,
  roboutCount1: number,
  cost2?: number,
  amount2?: number,
  robotCount2?: number
) {
  if ((cost1 && roboutCount1 === 0) || (cost2 && robotCount2 === 0)) {
    return Infinity;
  }
  const steps1 =
    cost1 <= amount1 ? 0 : Math.ceil((cost1 - amount1) / roboutCount1);
  const steps2 =
    !cost2 || cost2 <= amount2!
      ? 0
      : Math.ceil((cost2 - amount2!) / robotCount2!);
  return Math.max(steps1, steps2) + 1;
}
