// https://adventofcode.com/2022/day/4

interface Assignment {
  startId: number;
  endId: number;
}

export function part1(input: string) {
  const assignmentPairs = parseInput(input);
  return assignmentPairs.filter(assignmentsFullyOverlap).length;
}

export function part2(input: string) {
  const assignmentPairs = parseInput(input);
  return assignmentPairs.filter(assignmentsOverlap).length;
}

function parseInput(input: string) {
  return input.split('\n').map((row) => {
    const [assignment1, assignment2] = row.split(',');
    return [parseAssignment(assignment1), parseAssignment(assignment2)];
  });
}

function parseAssignment(assignment: string): Assignment {
  const [startId, endId] = assignment.split('-');
  return {
    startId: +startId,
    endId: +endId,
  };
}

function assignmentsFullyOverlap([assignment1, assignment2]: [
  Assignment,
  Assignment
]) {
  return (
    rangeInRange(assignment1, assignment2) ||
    rangeInRange(assignment2, assignment1)
  );
}

function assignmentsOverlap([assignment1, assignment2]: [
  Assignment,
  Assignment
]) {
  return (
    valueInRange(assignment1.startId, assignment2) ||
    valueInRange(assignment1.endId, assignment2) ||
    valueInRange(assignment2.startId, assignment1) ||
    valueInRange(assignment2.endId, assignment1)
  );
}

function rangeInRange(range1: Assignment, range2: Assignment) {
  return range2.startId <= range1.startId && range1.endId <= range2.endId;
}

function valueInRange(id: number, range: Assignment) {
  return range.startId <= id && id <= range.endId;
}
