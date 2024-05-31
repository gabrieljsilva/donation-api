export class AdjacencyGraph<V, E> {
  private readonly adjacencyList: Map<V, Map<V, E>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex: V) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, new Map());
    }
  }

  addEdge(vertex1: V, vertex2: V, edge: E) {
    if (!this.adjacencyList.has(vertex1)) {
      this.addVertex(vertex1);
    }

    if (!this.adjacencyList.has(vertex2)) {
      this.addVertex(vertex2);
    }
    this.adjacencyList.get(vertex1)?.set(vertex2, edge);
  }

  getEdges(vertex: V) {
    return this.adjacencyList.get(vertex);
  }

  transform<NewVertices, NewEdges>(
    resolveVertexFn: (vertex: V) => NewVertices,
    resolveEdgesFn: (edge: E, neighbor: NewVertices) => NewEdges,
  ) {
    const newGraph = new AdjacencyGraph<NewVertices, NewEdges>();
    for (const [vertex, edges] of this.adjacencyList) {
      const resolvedVertex = resolveVertexFn(vertex);
      newGraph.addVertex(resolvedVertex);
      for (const [neighbor, value] of edges) {
        const resolvedNeighbor = resolveVertexFn(neighbor);
        newGraph.addEdge(resolvedVertex, resolvedNeighbor, resolveEdgesFn(value, resolvedNeighbor));
      }
    }
    return newGraph;
  }
}