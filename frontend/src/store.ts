// graphStore.ts
import {create} from 'zustand';
import Graph from 'graphology';
import {  GraphData, convertToJsonMygraph, createGraphFromJSON } from './hooks/utilities';
//import jsonData from './hooks/data';
import ForceSupervisor from "graphology-layout-force/worker";
import jsonData from './hooks/data';

interface Edge{
  source: string, 
  target: string,
}

type State = {
  mygraph: Graph;
  layout: ForceSupervisor;
  username: string | null;
  loadGraph: boolean;
  storeGraph: boolean;
  fileLoaded:boolean;
  loadVisits: boolean;
  visits: string[];
  track: string[];
  aristas:  Edge[];
  tokenCameraApp: string | null,
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
  removeTrack: () => GraphData;
  setTrack: (track : string[]) => void;
  setTokenCameraApp: (token : string) => void;
  removeTokenCameraApp: () => void;
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
const initializeTrack = () => {
  const res = localStorage.getItem("track");
  if(res){
      return res.split(',');
  }
  return [];
}
const initializeAristas = () => {
  const res = localStorage.getItem("aristas");
  if(res){
      return JSON.parse(res)
  }
  return [];
}
const initializeToken = () => {
  const res = localStorage.getItem("token");
  if(res){
      return res;
  }
  else{
    return null;
  }
}


const useGraphStore = create<Store & Action>((set, getState) => {
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
        track: initializeTrack(),
        aristas: initializeAristas(),
        tokenCameraApp: initializeToken(),

        setGraphFromJson: (data: GraphData) => {
            try {
                const newGraph = createGraphFromJSON(data);
                const layout = new ForceSupervisor(newGraph);
                
                set({ 
                    mygraph: newGraph, 

                });
                localStorage.setItem("mygraph", JSON.stringify(data));
        
                layout.start();
            } catch (error) {
                console.error('Error updating graph from JSON:', error);
            }
        },
        setUser: (name : string | null) => {
          try {
              if(name) localStorage.setItem('username', name);
              else localStorage.removeItem('username');
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

            set(() => ({
                mygraph: newGraph,
            }));

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

                  const arrayLength = nodos.length;

                  while (vis.length - 1 < visits) {
                      const randomIndex = Math.floor(Math.random() * arrayLength);
                      const randomNode = nodos[randomIndex];
                      
                      // Verificar si el nodo no es source, target o ya está en vis
                      if (randomNode !== source && randomNode !== target && !vis.includes(randomNode)) {
                          newGraph.setNodeAttribute(randomNode, 'color', 'red');
                          vis.push(randomNode);
                      }
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

            }));
            layout.start();

          }catch(err){
            console.error("Error borrando visitas ", err);              
          }
        }, 
        setTrack : (track : string[]) =>{
          try{
            const newGraph = getState().mygraph.copy();
            const edges : Edge[] = [];

            for (let i = 0; i < track.length - 1; i++) {
              if(newGraph.hasEdge(newGraph.edge(track[i], track[i + 1]))){

                newGraph.setEdgeAttribute(newGraph.edge(track[i], track[i + 1]),'size', 6);
                newGraph.setEdgeAttribute(newGraph.edge(track[i], track[i + 1]),'type', 'arrow');
                newGraph.setEdgeAttribute(newGraph.edge(track[i], track[i + 1]),'color', 'orange');

              }else {

                const edge = newGraph.addEdge(track[i ], track[i + 1]);
                edges.push({
                  source: track[i],
                  target: track[i + 1],
                });
                newGraph.setEdgeAttribute(edge,'size', 6);
                newGraph.setEdgeAttribute(edge,'type', 'arrow');
                newGraph.setEdgeAttribute(edge,'color', 'orange');
                newGraph.setEdgeAttribute(edge,'weight',newGraph.getEdgeAttribute(newGraph.edge(track[i+ 1], track[i]), 'weight'));                 

              }

            }
          
            const layout = new ForceSupervisor(newGraph);
            localStorage.setItem('track', track.toString());
            const myjson = convertToJsonMygraph(newGraph);
            localStorage.setItem('mygraph', JSON.stringify(myjson));
            localStorage.setItem('aristas', JSON.stringify(edges));

            set(() => ({
              mygraph: newGraph,
              track: track,
              aristas: edges,
            }));
            layout.start();

          }catch(err){
            console.error("Error seteando track ", err);              
          }
        },
        removeTrack : () =>{
          try{

            const track = getState().track;
            const newGraph = getState().mygraph.copy();
            let myjson = convertToJsonMygraph(newGraph);

            for (let i = 0; i < track.length - 1; i++) {
                  newGraph.setEdgeAttribute(newGraph.edge(track[i], track[i + 1]),'type', 'line');
                  newGraph.setEdgeAttribute(newGraph.edge(track[i], track[i + 1]),'size', 1);
                  newGraph.setEdgeAttribute(newGraph.edge(track[i], track[i + 1]),'color', null);
                
            }
            for (let i = 0; i < getState().aristas.length ; i++){
              newGraph.dropEdge(newGraph.edge(getState().aristas[i].source, getState().aristas[i].target));
            }
            const layout = new ForceSupervisor(newGraph);
            localStorage.removeItem('track');
            myjson = convertToJsonMygraph(newGraph);
            localStorage.setItem('mygraph', JSON.stringify(myjson));
            localStorage.removeItem('aristas');

            set(() => ({
              mygraph: newGraph,
              track: [],
              aristas: [],
            }));
            layout.start();
            return myjson;
          }catch(err){
            console.error("Error borrando track ", err);              
          }
        },
        setTokenCameraApp: (token : string) => {

          localStorage.setItem('token',token);
          set(() => ({
            tokenCameraApp: token,
          }));

        },
        removeTokenCameraApp: () => {
            localStorage.removeItem('token');
            set({
                tokenCameraApp: null,
            });
        },

      }
});
  
  
export default useGraphStore;
