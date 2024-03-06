import { useRef, ChangeEvent } from 'react';
import { FiUpload, FiPlus, FiTrash2, FiLogOut, FiLogIn } from 'react-icons/fi'; // Importar iconos de Feather Icons
import { useNavigate } from "react-router-dom";

import useGraphStore from "../store";
import { IoAnalytics } from 'react-icons/io5';
import { handleClickGenerateTrack } from '../hooks/handleClick';
import {  convertToJsonMygraph } from "../hooks/utilities";

const Navbar = () => {
    const navigate = useNavigate();
    const {deleteGraph} =  useGraphStore();
    const { setOptCargando,setTrack, mygraph ,setGraphFromJson,removeTrack, username, optCargando, setUser, setLoadGraph, setAddEdge, setAddNode, setStoreGraph, setFileLoaded,setLoadVisits,  removeVisits , visits, track} = useGraphStore();
    const formRef = useRef<HTMLDivElement>(null); // Referencia al elemento del formulario
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    setGraphFromJson(data);
                } catch (error) {
                    console.log('Error:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleClickLoadData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        fileInputRef.current?.click();

    };

    const handleClickAddNode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setAddNode(true);
        setAddEdge(false);
        setLoadGraph(false);
        setStoreGraph(false);
        
        scrollToForm();
    };

    const handleClickAddEdge = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setAddEdge(true);
        setAddNode(false);
        setLoadGraph(false);
        setStoreGraph(false);
        scrollToForm();
    };

    const handleClickLogOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setUser(null);
    };

    const handleClickLogIn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleClickLoadGraph = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoadGraph(true);
        setStoreGraph(false);
        setAddEdge(false);
        setAddNode(false);
    };

    const handleClickSaveGraph = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setStoreGraph(true);
        setLoadGraph(false);
        setAddEdge(false);
        setAddNode(false);
    };

    const handleClickDeleteGraph = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (visits.length > 0) removeVisits();
        if(track.length > 0) removeTrack();
        deleteGraph();
        setFileLoaded(false);
    
    };


    const scrollToForm = () => {
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50); // Ajusta el valor del retraso según sea necesario
    };

    const handleClickTrack = async () =>{
        
        let myjson;
        if(track.length > 0) myjson = removeTrack();
        else myjson = convertToJsonMygraph(mygraph);
        setOptCargando(true);

        const trackGenerated = await handleClickGenerateTrack(myjson, visits, username);
        setOptCargando(false);

        if(trackGenerated){
            if(trackGenerated.nodos) setTrack(trackGenerated.nodos);
        }

    }


    return (
        
            <div className="bg-gray-700 w-1/4 flex flex-col items-start">
                <div className="w-full flex-col items-start h-2/3 ">
                    <button onClick={handleClickLoadData} className="w-full mt-1 mb-5 h-10 px-3 py-2 inline-flex items-center border border-transparent text-sm font-medium rounded-md text-blue-500 bg-transparent hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                        <FiUpload className="mr-2" /> <p>FILE</p>
                    </button>
                    <button onClick={handleClickAddNode} className="w-full mt-1  px-3 h-10 py-2 inline-flex items-center border border-transparent text-sm font-medium rounded-md text-green-500 bg-transparent hover:bg-green-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
                        <FiPlus className="mr-2" /> ADD NODE
                    </button>
                    <button onClick={handleClickAddEdge} className="w-full  mt-1 mb-5 px-3 py-2 h-10  inline-flex items-center  border border-transparent text-sm font-medium rounded-md text-yellow-500 bg-transparent hover:bg-yellow-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500">
                        <FiPlus className="mr-2" /> ADD EDGE
                    </button>
                    <button onClick={handleClickLoadGraph} className="w-full  mt-1 h-10  px-3 py-2 inline-flex items-center border border-transparent text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500">
                        <FiUpload className="mr-2" /> LOAD GRAPH
                    </button>
                    <button onClick={handleClickSaveGraph} className="w-full mt-1 h-10  px-3 py-2 inline-flex items-center border border-transparent text-sm font-medium rounded-md text-orange-500 bg-transparent hover:bg-orange-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500">
                        <FiUpload className="mr-2" /> SAVE GRAPH
                    </button>
                    <button onClick={handleClickDeleteGraph} className="w-full mt-1 h-10 mb-5 px-3 py-2 inline-flex items-center border border-transparent text-sm font-medium rounded-md text-purple-500 bg-transparent hover:bg-purple-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500">
                        <FiTrash2 className="mr-2" /> DELETE GRAPH
                    </button>
                    { !optCargando ? <button onClick={() => setLoadVisits(true)} className="w-full h-10 px-3 py-2 mt-1 uppercase inline-flex  border border-transparent text-sm font-medium rounded-md text-red-500 bg-transparent hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                            <FiUpload className="mr-2" /> LOAD VISITS
                    </button> :
                        <button onClick={() => setLoadVisits(true)} className="w-full h-10 px-3 py-2 mt-1 uppercase inline-flex  border border-transparent text-sm font-medium rounded-md text-gray-500 bg-red-600  bg-opacity-20 cursor-not-allowed" disabled>
                            <FiUpload className="mr-2" /> LOAD VISITS
                        </button>
                    }
                    {visits.length > 2 && !optCargando && (
                        <button onClick={handleClickTrack} className="w-full h-10 px-3 py-2 mt-1 uppercase inline-flex items-center  border border-transparent text-sm font-medium rounded-md text-green-500 bg-transparent hover:bg-green-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
                            <IoAnalytics className="mr-2"/>generate track
                        </button>
                    )}

                </div>
                <div className='h-1/3 w-full flex items-end mb-3 '>
                    {username ?
                        <button onClick={handleClickLogOut} className="w-full h-10 px-3 py-2 uppercase inline-flex  border border-transparent text-sm font-medium rounded-md text-red-500 bg-transparent hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                            <FiLogOut className="mr-2" /> log out
                        </button>
                        :
                        <button onClick={handleClickLogIn} className="w-full h-10 px-3 py-2  uppercase inline-flex  border border-transparent text-sm font-medium rounded-md text-blue-500 bg-transparent hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                            <FiLogIn className="mr-2" /> log in
                        </button>
                    }
                </div>
            </div>

    )
}

export default Navbar;
