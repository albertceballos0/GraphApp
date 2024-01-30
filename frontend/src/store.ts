// graphStore.ts
import {create} from 'zustand';
import Graph from 'graphology';
import { GraphData, createGraphFromJSON } from './hooks/utilities';
//import jsonData from './hooks/data';
import ForceSupervisor from "graphology-layout-force/worker";
import jsonData from './hooks/data';

// Define el tipo de estado
type State = {
  mygraph: Graph;
  layout: ForceSupervisor;
};

// Define el tipo de acción
type Action = {
  updateGraph: (mygraph: Graph) => void;
  setGraphFromJson: () => void; 
  addNode: ({ name,size, color, x, y} : { name: string; size: number; color: string; x: number; y:number}) => void;

};

// Combina ambos tipos para crear el tipo completo del store
type Store = State & Action;


// Crea tu store con Zustand
const useGraphStore = create<Store>((set) => {
      const graph = createGraphFromJSON(jsonData);
      console.log(graph)
      const layout = new ForceSupervisor(graph);
      layout.start();

      return {
        mygraph: graph,
        layout: layout,
        setGraphFromJson: (data: GraphData) => {
            try {
                const newGraph = createGraphFromJSON(data);
                const layout = new ForceSupervisor(newGraph);

                set({ 
                    mygraph: newGraph, 
                    layout: layout,

                });
                layout.start();
            } catch (error) {
                console.error('Error updating graph from JSON:', error);
            }
            },
        addNode: (name : string ,size : number, color: string, x : number, y : number) => {
            try {
                
                set((state) => ({
                    mygraph: state.mygraph.addNode(name, { size, name, color, x, y}),
                  }));
            } catch (error) {
                console.error('Error updating graph from JSON:', error);
            }
        },

      }   
  });
  
  
export default useGraphStore;
