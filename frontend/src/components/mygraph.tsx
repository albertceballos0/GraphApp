import {useEffect, FC } from "react";
import { useLoadGraph, useSigma } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
// Ejemplo con Lodash para clonación profunda
import useGraphStore from "../store";



// context2Object sigue siendo igual a originalObject

const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();
  const mygraph = useGraphStore((state) => state.mygraph);
  const sigma = useSigma();


  useEffect(() => {
    const setGraphAsync = async () => {
      await sigma.setGraph(mygraph);
    };

    setGraphAsync();
  }, [mygraph]);

  useEffect(() => {
    // Create the graph

    loadGraph(mygraph);
  }, [loadGraph]);

  return null;
};

export default MyGraph;