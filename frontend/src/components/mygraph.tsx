import {useEffect, FC } from "react";
import {  useSigma, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import useGraphStore from "../store";
import jsonData from "../hooks/data";



const MyGraph: FC = () => {
  const {mygraph, setGraphFromJson } = useGraphStore();
  const sigma = useSigma();
  useEffect(() => {
      const storedGraph = localStorage.getItem("mygraph");
      if (storedGraph) {
        const parsedGraph = JSON.parse(storedGraph);
        setGraphFromJson(parsedGraph);
      } else {
        setGraphFromJson(jsonData);
      }

  }, [])
  
  useEffect(() => {
      sigma.setGraph(mygraph);
  }, [mygraph, sigma]);


  return null;
};

export default MyGraph;