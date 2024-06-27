# GraphApplication ReadMe

## Overview

The `GraphApplication` project is a comprehensive implementation of graph-related algorithms and data structures in C++. This project includes various graph components such as vertices, edges, and several graph algorithms like Dijkstra's algorithm, Traveling Salesman Problem (TSP) solutions, and more.

## File Structure

### Header Files

- **Graph.h**: Header guard for the Graph-related classes and functions.

### Source Files

- **AssertsMaximFluxe.cpp**: Main source file containing the implementation of graph classes and algorithms.

## Key Classes and Functions

### Utility Functions

- `string StrPrint(const char* Format, ...);`: Utility function for formatted string output.

### Debug Functions

- `bool MyAssertFun(const char* strcond, const char* FileName, int line, const char* Msg = NULL);`: Custom assert function for debugging.

### Exception Handling

- `class MyException`: Custom exception class for handling errors within the application.

### CGPoint Class

Represents a point in a 2D space.

- **Attributes**:
  - `double m_X, m_Y`: Coordinates of the point.
  
- **Methods**:
  - Overloaded operators for addition, subtraction, multiplication, and division.
  - Methods to calculate distance, module, and comparisons.

### CVertex Class

Represents a vertex in the graph.

- **Attributes**:
  - `string m_Name`: Name of the vertex.
  - `CGPoint m_Point`: Position of the vertex.
  - `list<CEdge*> m_Edges`: Edges connected to the vertex.
  - Attributes for various algorithms (Dijkstra, Kruskal, marking, path finding).
  
- **Methods**:
  - Methods to find edges, check membership, and unlink edges.

### CEdge Class

Represents an edge in the graph.

- **Attributes**:
  - `string m_Name`: Name of the edge.
  - `double m_Length`: Length or weight of the edge.
  - `CVertex* m_pOrigin, *m_pDestination`: Pointers to the origin and destination vertices.
  - `CEdge* m_pReverseEdge`: Pointer to the reverse edge in undirected graphs.

### CGraph Class

Represents the graph itself.

- **Attributes**:
  - `list<CVertex> m_Vertices`: List of vertices in the graph.
  - `list<CEdge> m_Edges`: List of edges in the graph.
  - `bool m_Directed`: Flag indicating if the graph is directed.
  
- **Methods**:
  - Methods for adding, finding, and deleting vertices and edges.
  - Methods for loading and saving graph data.
  - Methods for creating random and grid graphs.
  - Utility methods for graph manipulation.

### CVisits Class

Represents a collection of vertices to be visited in a graph traversal.

- **Attributes**:
  - `list<CVertex*> m_Vertices`: List of vertices to visit.
  - `CGraph* m_pGraph`: Pointer to the associated graph.
  
- **Methods**:
  - Methods to manage the list of vertices, check membership, and load/save visit data.

### CTrack Class

Represents a path or track in the graph.

- **Attributes**:
  - `list<CEdge*> m_Edges`: List of edges forming the track.
  - `CGraph* m_pGraph`: Pointer to the associated graph.
  
- **Methods**:
  - Methods to manage the track, calculate its length, and load/save track data.

### Algorithms

- `void Dijkstra(CGraph& g, CVertex* pStart);`: Dijkstra's shortest path algorithm.
- `CTrack SalesmanTrackGreedy(CGraph& g, CVisits& visits);`: Greedy algorithm for TSP.
- Other TSP solutions: Backtracking, Branch and Bound, Probabilistic.
- `CTrack TrobaCami1(CGraph& g);`: Pathfinding algorithms.


## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
