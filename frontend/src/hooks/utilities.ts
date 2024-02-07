import Graph from "graphology";
import { GraphConstructor } from "graphology-types";

interface Node {
  id: string;
  size: number;
  label: string;
  color: string;
  x:number,
  y:number,
}

interface Edge {
  source: string;
  target: string;
  type: string;
  label: string;
  size: number;
  weight: number;
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

            newGraph.addNode(id, { size, label, color, x, y });
        });
    
        jsonData.edges.map((edge) => {
        const { source, target, type, label, size, weight } = edge;
        newGraph.addEdge(source, target, { type, label, size, weight});
        });
    
    
    }
    catch (error) {
        console.error('Error creating graph from JSON:', error);
      }
    return newGraph;

  }


export function convertToJsonMygraph(mygraph : Graph) {
    const nodeAttributesArray : Node[]= [];
    mygraph.forEachNode(( node, attributes) => {
        nodeAttributesArray.push({
          id:node,
          label: node,
          size: attributes.size,
          color: attributes.color, 
          x: attributes.x,
          y: attributes.y,
        });
    });
    const edgeAttributesArray : Edge[]= [];
    mygraph.forEachEdge((edge, attributes, source, target) => {
        edgeAttributesArray.push({
          source: source,
          target: target,
          label: attributes.label,
          type: attributes.type,
          size: attributes.size,
          weight: attributes.weight,
        });
    });
    const myjson : GraphData = {
        nodes: nodeAttributesArray,
        edges: edgeAttributesArray,
    };
    return myjson;

}


export function convertirTextoAJSON(texto : string) {
  const lineas = texto.trim().split('\n');
  let esNodos : boolean = false;
  let esEdge : boolean = false;
  const nodes : Node[] = [];
  const edges : Edge[] = [];

  for (const linea of lineas) {

    const partes = linea.trim().split(' ');


    if (partes[0] === 'VERTICES') {
      esNodos = true;
      esEdge = false;
      continue;
    } else if (partes[0] === 'EDGES') {
      esNodos = false;
      esEdge = true;
      continue;
    }

    if (esNodos) {
      nodes.push({
        id: partes[0],
        x: partes[1],
        y: partes[2],
        color: 'green',
        label: partes[0],
        size: 7,
      });
    } else if(esEdge) {
      const nombreArista = partes[0];
      const peso = partes[1];
      const source = partes[2];
      const target = partes[3];

      edges.push({
        source: source, 
        target: target,
        size: 1, 
        label: nombreArista,
        type: 'line',
        weight: peso,
      });

    }
  }

  return { nodes, edges };
}

export function convertirJSONATexto(jsonData : GraphData) {
  let text = '';

  text += 'VERTICES\n';
  jsonData.nodes.forEach((node, index) => {
      text += `${node.id} ${node.x} ${node.y}\n`;
  });

  // Convertir aristas a texto
  text += 'EDGES\n';
  jsonData.edges.forEach((edge, index) => {
      text += `${edge.label } ${edge.weight} ${edge.source} ${edge.target}\n`;
  });

  return text;
}
