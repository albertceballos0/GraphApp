
const sha256 = require('crypto-js/sha256');



exports.convertirTextoAJSON = (texto)  =>{
  const lineas = texto.trim().split('\n');
  let esNodos  = false;
  let esEdge  = false;
  const nodes  = [];
  const edges = [];

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

exports.convertirJSONATexto = (jsonData ) =>{
  let text = '';
  text += 'GRAPH 1.0\n';
  text += 'UNDIRECTED\n';
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

