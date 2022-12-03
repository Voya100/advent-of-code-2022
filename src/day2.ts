// https://adventofcode.com/2022/day/2

import { numberSum } from './utils';

type ShapeKey = 'A' | 'B' | 'C' | 'Y' | 'X' | 'Z';

enum Shape {
  Rock = 1,
  Paper = 2,
  Scissors = 3
}

enum Outcome {
  Lose = 'X',
  Draw = 'Y',
  Victory = 'Z'
}

const outcomeScores = {
  victory: 6,
  draw: 3,
  loss: 0
}

const shapesByKey: Record<ShapeKey, Shape> = {
  A: Shape.Rock,
  B: Shape.Paper,
  C: Shape.Scissors,
  X: Shape.Rock,
  Y: Shape.Paper,
  Z: Shape.Scissors
}

const winningShape = {
  [Shape.Rock]: Shape.Paper,
  [Shape.Paper]: Shape.Scissors,
  [Shape.Scissors]: Shape.Rock
}

const losingShape = Object.fromEntries(
  Object.entries(winningShape).map(([key, value]) => [value, +key])
) as unknown as Record<Shape, Shape>;


export function part1(input: string) {
  const rounds = parseInput1(input);
  const roundScores = rounds.map(getRoundScore1);
  return numberSum(roundScores);
}

export function part2(input: string) {
  const rounds = parseInput2(input);
  const roundScores = rounds.map(getRoundScore2);
  return numberSum(roundScores);
}

function parseInput1(input: string) {
  return input
    .split('\n')
    .map(row => row.split(' ').map(value => shapesByKey[value as ShapeKey]) as [Shape, Shape]);
}

function parseInput2(input: string) {
  return input
    .split('\n')
    .map(row => {
      const [value1, value2] = row.split(' ');
      return { opponentShape: shapesByKey[value1 as ShapeKey], outcome: value2 as Outcome }
    });
}

function getRoundScore1([opponentShape, myShape]: [Shape, Shape]) {
  if (opponentShape === myShape) {
    return outcomeScores.draw + myShape;
  }
  const outcomeScore = isVictory(opponentShape, myShape) ? outcomeScores.victory : outcomeScores.loss;
  return outcomeScore + myShape;
}

function getRoundScore2(round: { opponentShape: Shape, outcome: Outcome }) {
  if (round.outcome === Outcome.Draw) {
    return outcomeScores.draw + round.opponentShape;
  }
  if (round.outcome === Outcome.Victory) {
    return outcomeScores.victory + winningShape[round.opponentShape];
  }
  return outcomeScores.loss + losingShape[round.opponentShape];
}

function isVictory(opponentShape: Shape, myShape: Shape) {
  return winningShape[opponentShape] === myShape;
}