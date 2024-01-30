import {useEffect, FC } from "react";
import { useLoadGraph, useSigma } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
// Ejemplo con Lodash para clonación profunda
import useGraphStore from "../store";
import jsonData from "../hooks/data";


// context2Object sigue siendo igual a originalObject

const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();
  const {mygraph, setGraphFromJson} = useGraphStore();
  const sigma = useSigma();


  useEffect(() => {
    setGraphFromJson(jsonData);
  }, [])
  
  useEffect(() => {
      sigma.setGraph(mygraph);
    }, [mygraph]);

  useEffect(() => {
    // Create the graph

    loadGraph(mygraph);
  }, [loadGraph]);

  return null;
};

export default MyGraph;