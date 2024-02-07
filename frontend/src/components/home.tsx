import React, { useRef, useEffect, useState } from 'react';
import "@react-sigma/core/lib/react-sigma.min.css";
import GraphEvents from "./GraphEvent";
import { MultiDirectedGraph } from "graphology";
import {
    SigmaContainer,

  } from "@react-sigma/core";
import useGraphStore from "../store";
import Navbar from "./navbar";
import MyGraph from "./mygraph";
import LoadGraph from "./LoadGraph";
import StoreGraph from "./StoreGraph";
import LoadVisits from './LoadVisits';

const Home = () => {
    const {username, loadGraph, storeGraph, setLoadGraph, setStoreGraph, fileLoaded, loadVisits, setLoadVisits } = useGraphStore();
    const loadGraphRef = useRef(null);
    const storeGraphRef = useRef(null);
    const loadVisitsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (storeGraphRef.current &&
                !storeGraphRef.current.contains(event.target))
            ) {
                setStoreGraph(false);
            }
            else if(
                loadGraphRef.current &&
                !loadGraphRef.current.contains(event.target)
            ){
                setLoadGraph(false);
            }else if (
                loadVisitsRef.current && 
                !loadVisitsRef.current.contains(event.target)
            ){
                setLoadVisits(false);
            }

        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="bg-gray-700 h-15 text-white px-1 py-2 flex justify-between items-center">
                <div>
                    {fileLoaded && (
                        <button onClick={() =>setLoadVisits(true)} className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-red-500 bg-transparent hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                            load visits
                        </button>
                    )}
                </div>
                <div className="flex-grow flex justify-center">
                    {username ? (
                        <p className="uppercase font-semibold text-xl">{username}</p>
                    ) : (
                        <p className="uppercase font-semibold text-xl">BIENVENIDO A GraphApp</p>
                    )}
                </div>
            </div>



            <SigmaContainer 
                style={{ height: '600px' }}
                graph={MultiDirectedGraph}
            >
                <MyGraph />
                <GraphEvents />

            </SigmaContainer>

            {
              loadGraph ? 
              <div ref={loadGraphRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <LoadGraph />
              </div>
              :
              <></>
            }
            {
              storeGraph ? 
              <div ref={storeGraphRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <StoreGraph />

              </div>
              :
              <></>
            }
                        {
              loadVisits ? 
              <div ref={loadVisitsRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <LoadVisits />

              </div>
              :
              <></>
            }
            <Navbar />  


        </div>
    );
}

export default Home;
