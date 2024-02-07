// graphStore.ts
import {create} from 'zustand';
import Graph from 'graphology';
import { GraphData, convertToJsonMygraph, createGraphFromJSON } from './hooks/utilities';
//import jsonData from './hooks/data';
import ForceSupervisor from "graphology-layout-force/worker";
import jsonData from './hooks/data';

type State = {
  mygraph: Graph;
  layout: ForceSupervisor;

  username: string | null;
  loadGraph: boolean;
  storeGraph: boolean;
  fileLoaded:boolean;
  loadVisits: boolean;
  visits: string[];
};

// Define el tipo de acción
type Action = {
  updateGraph: (mygraph: Graph) => void;
  setGraphFromJson: (data: GraphData) => void; 
  setUser: (name: string | null) => void;
  setLoadGraph: (opt: boolean) => void;
  setFileLoaded: (opt: boolean) => void;
  deleteGraph: () => void; 
  setStoreGraph: (opt: boolean) => void;
  setLoadVisits: (opt: boolean) => void;
  addNode: (arg0: string, arg1: { size: number; color: string; x: number; y: number; }) => void;  
  addEdge: (source: string, target: string, arg: { tipo: string, label: string,size: number, weight: number }) => void; 
  setVisits: (source: string, target: string, visits: number) => void;
  removeVisits: () => void;
};

// Combina ambos tipos para crear el tipo completo del store
type Store = State & Action;


// Crea tu store con Zustand
const initializeUsername = () => {
  
  const res = localStorage.getItem("username");
  if(res){
      return res;
  }
  return null;
};


const initializeFileLoaded = () => {
  const res = localStorage.getItem("fileLoaded");
  if(res === "true"){
      return true;
  }
  return false;
}
const initializeVisits = () => {
  const res = localStorage.getItem("visits");
  if(res){
      return res.split(',');
  }
  return [];
}

const useGraphStore = create<Store>((set, getState) => {
      const graph = createGraphFromJSON(jsonData);
      const layout = new ForceSupervisor(graph);
      layout.start();

      return {
        mygraph: graph,
        layout: layout,
        username: initializeUsername(),
        loadGraph: false,
        storeGraph: false,
        loadVisits: false,
        fileLoaded: initializeFileLoaded(),
        visits: initializeVisits(),

        setGraphFromJson: (data: GraphData) => {
            try {
                const newGraph = createGraphFromJSON(data);
                const layout = new ForceSupervisor(newGraph);
                
                set({ 
                    mygraph: newGraph, 
                    layout: layout,

                });
                localStorage.setItem("mygraph", JSON.stringify(data));
        
                layout.start();
            } catch (error) {
                console.error('Error updating graph from JSON:', error);
            }
        },
        setUser: (name : string | null) => {
          try {
              set(() => ({
                  username: name,
                }));
          } catch (error) {
              console.error('Error setting user', error);
          }
        },
        setLoadGraph: (opt: boolean) =>{
          try{
              set(() => ({
                loadGraph: opt,
              }));
          }catch(err){
            console.error("Error cambiando load Graph ", err);
          }

        },
        setFileLoaded: (opt: boolean) =>{
          try{
              localStorage.setItem("fileLoaded", String(opt));
              set(() => ({
                fileLoaded: opt,
              }));
          }catch(err){
            console.error("Error cambiando file load Graph ", err);
          }
        },

        setStoreGraph: (opt: boolean) =>{
          try{
              set(() => ({
                storeGraph: opt,
              }));
          }catch(err){
            console.error("Error cambiando store Graph ", err);
          }

        },
        addNode : (name : string, { size,color, x, y} : { size: number, color: string, x : number, y:number}) => {
          try{
            const newGraph = getState().mygraph.copy();
            newGraph.addNode(name, { size, name,color, x, y});
            const layout = new ForceSupervisor(newGraph);

            set(() => ({
                mygraph: newGraph,
                layout: layout,
            }));
            layout.start();

            const myjson = convertToJsonMygraph(newGraph);
            localStorage.setItem("mygraph", JSON.stringify(myjson));
            
          }catch(err){
            console.error("Error añadiendo nodo Graph ", err);
          }
        },
        addEdge : (source: string, target: string, {tipo, label, size, weight}: { tipo: string, label: string,size: number, weight: number }) => {
          try{
            const newGraph = getState().mygraph.copy();
            newGraph.addEdge(source,target, { tipo, label, size, weight});
            const layout = new ForceSupervisor(newGraph);

            set(() => ({
                mygraph: newGraph,
                layout: layout,
            }));
            layout.start();

            const myjson = convertToJsonMygraph(newGraph);
            localStorage.setItem("mygraph", JSON.stringify(myjson));
            
          }catch(err){
            console.error("Error añadiendo arista Graph ", err);
          }
        },
        deleteGraph : () => {
          try{
            const newGraph = new Graph();
            const layout = new ForceSupervisor(newGraph);

            set(() => ({
                mygraph: newGraph,
                layout: layout,
            }));
            layout.start();

            const myjson = convertToJsonMygraph(newGraph);
            localStorage.setItem("mygraph", JSON.stringify(myjson));
            localStorage.removeItem("visits");

          }catch(err){
            console.error("Error borrando grafo ", err);
          }
        },
        setLoadVisits: (opt : boolean) => {
          try{
            set(() => ({
             loadVisits: opt,
          }));
          }catch(err){
            console.error("Error cargando menu Visits ", err);
          }
        },
        setVisits: (source : string, target: string , visits: number) => {
            try{
                  const newGraph = getState().mygraph.copy();
                  
                  const NodeOptions = getState().mygraph.nodes();
                  const nodos: string[] = Array.from(NodeOptions);   
                  const vis: string[] = [source];
  
                  const randomIndices = new Set(); // Conjunto para almacenar valores únicos
                  const arrayLength = nodos.length;

                  while (randomIndices.size < visits) {
                    const randomIndex = Math.floor(Math.random() * arrayLength);
                    randomIndices.add(randomIndex); // Agregar el índice al conjunto
                    newGraph.setNodeAttribute(nodos[randomIndex], 'color', 'red');
                    vis.push(nodos[randomIndex]);
                  }
                  vis.push(target);
                  if(source === target ){
                    newGraph.setNodeAttribute(source, 'color', 'yellow');
                  }else{
                    newGraph.setNodeAttribute(source, 'color', 'purple');
                    newGraph.setNodeAttribute(target, 'color', 'black');
                  }
                  
                  const layout = new ForceSupervisor(newGraph);
                  localStorage.setItem('visits', vis.toString());
                  const myjson = convertToJsonMygraph(newGraph);
                  localStorage.setItem('mygraph', JSON.stringify(myjson));
                  set(() => ({
                    mygraph: newGraph,
                    visits: vis,
                    layout: layout,
    
                  }));
                  layout.start();

            }catch(err){
              console.error("Error generando visitas ", err);              
            }
        },
        removeVisits: () => {
          try{
            const newGraph = getState().mygraph.copy();
            getState().visits.forEach(element => {
              newGraph.setNodeAttribute(element, 'color', 'green');
            });

            const layout = new ForceSupervisor(newGraph);
            localStorage.removeItem('visits');
            const myjson = convertToJsonMygraph(newGraph);
            localStorage.setItem('mygraph', JSON.stringify(myjson));

            set(() => ({
              mygraph: newGraph,
              visits: [],
              layout: layout,

            }));
            layout.start();

          }catch(err){
            console.error("Error generando visitas ", err);              
          }
        }, 
      }
});
  
  
export default useGraphStore;
