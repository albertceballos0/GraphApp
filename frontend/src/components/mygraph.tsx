import {useEffect, FC } from "react";
import { useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useMyContext } from "../hooks/context";

const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();
  const {mygraph} = useMyContext();
  
  useEffect(() => {
    // Create the graph
    
    loadGraph(mygraph);
  }, [loadGraph]);

  return null;
};

export default MyGraph;