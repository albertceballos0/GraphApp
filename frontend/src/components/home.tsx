import { useRef, useEffect, useState } from 'react';
import "@react-sigma/core/lib/react-sigma.min.css";
import { MultiDirectedGraph } from "graphology";
import {
    SigmaContainer,

  } from "@react-sigma/core";
import useGraphStore from "../store";
import Navbar from "./Navbar";
import MyGraph from "./MyGraph";
import LoadGraph from "../forms/LoadGraph";
import StoreGraph from "../forms/StoreGraph";
import LoadVisits from '../forms/LoadVisits';
import { handleClickGenerateTrack } from '../hooks/handleClick';
import {  convertToJsonMygraph } from '../hooks/utilities';
import { IoAnalytics, IoCamera } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import FormEdge from '../forms/formEdge';
import FormNode from '../forms/formNode';

const Home = () => {
    const {username, loadGraph, removeTrack, storeGraph, optCargando, setOptCargando, setLoadGraph, setAddEdge, setAddNode, setStoreGraph, loadVisits, setLoadVisits , visits, mygraph, setTrack, track, optAddEdge, optAddNode} = useGraphStore();
    const loadGraphRef = useRef(null);
    const storeGraphRef = useRef(null);
    const loadVisitsRef = useRef(null);
    const addNodeRef = useRef(null);
    const addEdgeRef = useRef(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
            else if(
                addEdgeRef.current &&
                !addEdgeRef.current.contains(event.target)
            ){
                setAddEdge(false);
            }
            else if (
                addNodeRef.current &&
                !addNodeRef.current.contains(event.target)
            ){
                setAddNode(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className='h-screen flex flex-col'>
            <div className="bg-gray-700 h-16 text-white px-1 py-2 flex justify-between items-center">
                <div className='flex justify-start'>
                    <img className="w-10 p-1 ml-1" src="../../public/innovacion.png" alt="Logo" />
                </div>
                <div>
                    {username ? (
                        <p className="uppercase font-semibold text-xl">WELCOME - {username}</p>
                    ) : (
                        <p className="uppercase font-semibold text-xl">WELCOME GraphApp</p>
                    )}
                </div>
                <div className='px-2'>
                    <IoCamera 
                        onClick={() => navigate('/camera')}
                        className="text-gray-300 text-3xl rounded-md border border-gray-300 p-1 cursor-pointer hover:bg-gray-500 hover:border-gray-500 hover:text-gray-50"
                    />
                </div>
            </div>
            <div className='flex flex-1'>
                <Navbar /> 
                <SigmaContainer 
                    style={{ height:'100%'}} // Cambiado a '100%' para ocupar toda la altura disponible
                    graph={MultiDirectedGraph}
                >
                    <MyGraph />
                </SigmaContainer>
            </div>

            {
                error && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold"> ¡Error! </strong>
                            <span className="block sm:inline">{error}
                                <span className='ml-2'>
                                    <svg onClick={() => setError(null)} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M14.348 14.849a1 1 0 0 1-1.414 0L10 11.414l-2.935 2.435a1 1 0 1 1-1.264-1.546L8.636 10 5.701 7.065a1 1 0 0 1 1.264-1.546L10 8.586l2.935-2.435a1 1 0 0 1 1.414 1.435L11.414 10l2.935 2.935a1 1 0 0 1 0 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </div>
                    </div>
                )
            }

            {
                loadGraph && (
                    <div ref={loadGraphRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <LoadGraph />
                    </div>
                )
            }

            {
                storeGraph && (
                    <div ref={storeGraphRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <StoreGraph />
                    </div>
                )
            }
            {
                loadVisits && (
                    <div ref={loadVisitsRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <LoadVisits />
                    </div>
                )
            }
            {
                optAddNode && (
                    <div ref={addNodeRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <FormNode />
                    </div>
                )
            }
            {
                optAddEdge && (
                    <div ref={addEdgeRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <FormEdge />
                    </div>
                )
            }
        </div>
    );
}

export default Home;
