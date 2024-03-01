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
import { calcularChecksum, convertToJsonMygraph } from '../hooks/utilities';
import { IoCamera } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const {username, loadGraph, removeTrack, storeGraph, setLoadGraph, setStoreGraph, fileLoaded, loadVisits, setLoadVisits , visits, mygraph, setTrack, track} = useGraphStore();
    const loadGraphRef = useRef(null);
    const storeGraphRef = useRef(null);
    const loadVisitsRef = useRef(null);
    const [cargando, setCargando] = useState<boolean>(false);
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

        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickTrack = async () =>{
        
        let myjson;
        if(track.length > 0) myjson = removeTrack();
        else myjson = convertToJsonMygraph(mygraph);
        console.log(calcularChecksum(myjson));
        console.log(myjson);
        setCargando(true);

        const trackGenerated = await handleClickGenerateTrack(myjson, visits, username);
        setCargando(false);

        console.log(trackGenerated);
        if(trackGenerated){
            if(trackGenerated.nodos) setTrack(trackGenerated.nodos);
            else setError(trackGenerated.message);
        }

    }

    return (
        <div>
            <div className="bg-gray-700 h-15 text-white px-1 py-2 flex justify-between items-center">
                <div>
                    {!cargando && (
                        <button onClick={() =>setLoadVisits(true)} className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-red-500 bg-transparent hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                            load visits
                        </button>
                    )}
                </div>
                <div>
                    { visits.length > 2  && !cargando && (
                        <button onClick={handleClickTrack} className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-green-500 bg-transparent hover:bg-green-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
                            generate track
                        </button>
                    )}
                </div>
                <div className="inline-flex items-center px-2 py-1">
                    {username ? (
                        <p className="uppercase font-semibold text-xl">{username}</p>
                    ) : (
                        <p className="uppercase font-semibold text-xl">BIENVENIDO A GraphApp</p>
                    )}
                
                </div>
                <div className="inline-flex items-center px-2 py-1">
                    <IoCamera 
                        onClick={() => navigate('/camera')}
                        className="text-gray-300 text-3xl ml-4 rounded-md border mt-4 border-gray-300 p-1 cursor-pointer  hover:bg-gray-500 hover:border-gray-500 hover:text-gray-50"
                    />
                
                </div>
            </div>
            
            <SigmaContainer 
                    style={{ height: '600px' }}
                    graph={MultiDirectedGraph}
                >
                    <MyGraph />
                        
                        
            </SigmaContainer>
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
            )}

            {
              loadGraph && (
              <div ref={loadGraphRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <LoadGraph />
              </div>
            )}

            {
              storeGraph && (
              <div ref={storeGraphRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <StoreGraph />

              </div>
            )}
            {
              loadVisits && (
              <div ref={loadVisitsRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <LoadVisits />

              </div>
            )}

            <Navbar /> 

        </div>
    );
}

export default Home;
