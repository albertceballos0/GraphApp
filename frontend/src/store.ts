// graphStore.ts
import {create} from 'zustand';
import { MultiDirectedGraph } from 'graphology';
import { createGraphFromJSON } from './hooks/utilities';
import jsonData from './hooks/data';
import { GraphData } from './hooks/utilities';
// Define el tipo de estado
type State = {
  mygraph: MultiDirectedGraph;
};

// Define el tipo de acción
type Action = {
  updateGraph: (mygraph: MultiDirectedGraph) => void;
  removeGraph: () => void; // No se necesitan argumentos para clear
};

// Combina ambos tipos para crear el tipo completo del store
type Store = State & Action;


// Crea tu store con Zustand
const useGraphStore = create<Store>((set) => ({
  mygraph: new MultiDirectedGraph(),

  // Acción para actualizar el grafo
  updateGraph: (mygraph) => set({ mygraph }),

  // Acción para eliminar todos los nodos y bordes del grafo
  removeGraph: () => set((state) => ({ mygraph: state.mygraph.clear() })),
}));

export default useGraphStore;
