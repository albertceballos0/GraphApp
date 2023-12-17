import "@react-sigma/core/lib/react-sigma.min.css";
import GraphEvents from "./graph_event";
import MyGraph from "./mygraph";
import Fa2 from "./layout";
import { MultiDirectedGraph } from "graphology";
import {
    SigmaContainer,
    ControlsContainer,
    ZoomControl,
    SearchControl,
    FullScreenControl,
  } from "@react-sigma/core";
  import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import Navbar from "./navbar";
import MyContext from '../hooks/context';
import { contextValue } from "../hooks/utilities";
const Home = () => {

  return (
        <MyContext.Provider value={contextValue}>
            <SigmaContainer style={{ height: '500px' }}
                graph={MultiDirectedGraph}
                settings={{ renderEdgeLabels: true }}

            >
                <Navbar />  
                <MyGraph />
                <Fa2 />
                <ControlsContainer position={"bottom-right"}>
                    <ZoomControl />
                    <FullScreenControl />
                    <LayoutForceAtlas2Control settings={{ settings: { slowDown: 10 } }} />
                </ControlsContainer>
                <ControlsContainer position={"top-right"}>
                    <SearchControl style={{ width: "200px" }} />
                </ControlsContainer>
                <GraphEvents />
            </SigmaContainer>
        </MyContext.Provider>
        

   
  )
}

export default Home