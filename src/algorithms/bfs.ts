/**
 * Generic bredth-first seach implementation
 * @param start        Start node
 * @param isTargetNode Callback for determining whether node is the target or nt
 * @param options      Options which may be passed to node's getAdjacentNodes method
 * @returns
 */
export function findTargetWithBfs<ValueType, Options>(
  start: BfsNode<ValueType, Options>,
  isTargetNode: (node: BfsNode<ValueType, Options>) => boolean,
  options: Options
) {
  const nodesToCheck: BfsNode<ValueType, Options>[] = [start];
  let currentNode = start;
  while (nodesToCheck.length) {
    // A dequeue would be a better solution due to shift's O(n) complexity, but is performant enough
    currentNode = nodesToCheck.shift()!;
    if (currentNode.nodeState.checked) {
      continue;
    }
    currentNode.nodeState.checked = true;

    for (const node of currentNode.getAdjacentNodes(options)) {
      if (!node.nodeState.previousNode && node !== start) {
        nodesToCheck.push(node);
        node.nodeState.previousNode = currentNode;
      }
      if (isTargetNode(node)) {
        return node;
      }
    }
  }
  throw new Error('Target not found');
}

/**
 * Generic node type for breadth-first search (BFS)
 */
export abstract class BfsNode<ValueType, Options> {
  value!: ValueType;

  nodeState = {
    checked: false,
    previousNode: undefined as BfsNode<ValueType, Options> | undefined,
  };

  abstract getAdjacentNodes(options: Options): BfsNode<ValueType, Options>[];

  getDistanceToStart(): number {
    if (this.nodeState.previousNode) {
      return this.nodeState.previousNode.getDistanceToStart() + 1;
    }
    return 0;
  }

  get startNode(): BfsNode<ValueType, Options> {
    return (
      (this.nodeState.previousNode && this.nodeState.previousNode.startNode) ||
      this
    );
  }

  resetNodeState() {
    this.nodeState = {
      checked: false,
      previousNode: undefined,
    };
  }
}
