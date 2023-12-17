import { MultiDirectedGraph } from "graphology";
import { MyContextType } from "./context";
import jsonData from "./data";

interface Node {
  id: string;
  size: number;
  label: string;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  type: string;
  label: string;
  size: number;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export function createGraphFromJSON(graph: MultiDirectedGraph, jsonData: GraphData): void {
  // Crear nodos
  
  jsonData.nodes.forEach((node) => {
    console.log(node);
    const { id, size, label, color } = node;
    graph.addNode(id, { size, label, color });
    
  });

  // Crear aristas
  jsonData.edges.forEach((edge) => {
    const { source, target, type, label, size } = edge;
    graph.addEdge(source, target, { type, label, size });
  });

  // Asignar posiciones a los nodos
  graph.nodes().forEach((node, i) => {
    const angle = (i * 2* Math.PI) / graph.order;
    graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
    graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
  });
}



const graph : MultiDirectedGraph = new MultiDirectedGraph();
createGraphFromJSON(graph, jsonData);

export const contextValue: MyContextType = {
    mygraph: graph,
    // Agrega más valores al contexto según sea necesario
};

