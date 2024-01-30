import Graph from "graphology";

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

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export function createGraphFromJSON( jsonData: GraphData): Graph {
    const newGraph = new Graph();

    try{
        jsonData.nodes.map((node, i) => {
            const { id, size, label, color } = node;
            const angle = (i * 2 * Math.PI) / jsonData.nodes.length;
            const x = 100 * Math.cos(angle);
            const y = 100 * Math.sin(angle);
            console.log(id, size, label , color, x, y)
            newGraph.addNode(id, { size, label, color, x, y });

        });
    
        jsonData.edges.map((edge) => {
        const { source, target, type, label, size } = edge;
        newGraph.addEdge(source, target, { type, label, size });
        });
    
    
    }
    catch (error) {
        console.error('Error creating graph from JSON:', error);
      }
      console.log(newGraph);
      return newGraph;

  }
  