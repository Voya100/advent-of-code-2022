// https://adventofcode.com/2022/day/7

import { numberSum, sum } from './utils';

const SIZE_LIMIT = 100000;
const TOTAL_SPACE = 70000000;
const REQUIRED_SPACE = 30000000;

export function part1(input: string) {
  const rootDirectory = parseInput(input);
  rootDirectory.calculateSize();
  const directorySizes = rootDirectory
    .getAllDirectories()
    .map((dir) => dir.cachedSize);
  return numberSum(directorySizes.filter((size) => size <= SIZE_LIMIT));
}

export function part2(input: string) {
  const rootDirectory = parseInput(input);
  rootDirectory.calculateSize();
  const remainingSpace = TOTAL_SPACE - rootDirectory.cachedSize;
  const neededSpace = REQUIRED_SPACE - remainingSpace;

  const directorySizes = rootDirectory
    .getAllDirectories()
    .map((dir) => dir.cachedSize)
    .sort((a, b) => a - b);

  return directorySizes.find((size) => size >= neededSpace);
}

function parseInput(input: string) {
  // Assumption: always starting at root
  const rootDirectory = new Directory();
  let activeDirectory = rootDirectory;

  const terminalSections = input
    .split('$ ')
    .map((section) => section.trim())
    .filter((section) => section);
  for (const terminalSection of terminalSections) {
    const [commandRow, ...outputRows] = terminalSection.split('\n');
    const [command, input] = commandRow.split(' ');
    switch (command) {
      case 'cd':
        activeDirectory = activeDirectory.cd(input)!;
        break;
      case 'ls':
        activeDirectory.updateDirectoryState(outputRows);
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }
  return rootDirectory;
}

class Directory {
  directories: Record<string, Directory> = {};
  files: File[] = [];
  cachedSize = 0;

  constructor(private parentDirectory?: Directory) {}

  cd(path: string) {
    if (path === '..') {
      return this.parentDirectory;
    }
    if (path === '/') {
      return this.getRoot();
    }
    // Note: Assuming that updateDirectoryState (ls command) has been used before
    // trying to navigate to directory
    return this.directories[path];
  }

  /**
   * Updates directory's directories and files lists with output rows received from ls command.
   * Assumes that this is called maximum of one time for each directory.
   */
  updateDirectoryState(listOutputRows: string[]) {
    for (const row of listOutputRows) {
      if (row.startsWith('dir ')) {
        const dirName = row.split(' ')[1];
        this.directories[dirName] = new Directory(this);
      } else {
        const [size, name] = row.split(' ');
        this.files.push({
          size: +size,
          name,
        });
      }
    }
  }

  getRoot(): Directory {
    if (!this.parentDirectory) {
      return this;
    }
    return this.parentDirectory.getRoot();
  }

  calculateSize(): number {
    const fileSizes = sum(this.files, (file) => file.size);
    const dirSize = sum(Object.values(this.directories), (dir) =>
      dir.calculateSize()
    );
    this.cachedSize = fileSizes + dirSize;
    return this.cachedSize;
  }

  getAllDirectories(): Directory[] {
    return [
      this,
      ...Object.values(this.directories).flatMap((dir) =>
        dir.getAllDirectories()
      ),
    ];
  }
}

interface File {
  name: string;
  size: number;
}
