import { useRef, ChangeEvent, useState } from 'react';
import { FiUpload, FiPlus, FiTrash2, FiLogOut, FiLogIn } from 'react-icons/fi'; // Importar iconos de Feather Icons
import { useNavigate } from "react-router-dom";
import FormNode from "../forms/formNode";
import FormEdge from "../forms/formEdge";
import useGraphStore from "../store";

const Navbar = () => {
    const [addNode, setAddNode] = useState(false);
    const [addEdge, setAddEdge] = useState(false);
    const navigate = useNavigate();
    const {deleteGraph} =  useGraphStore();
    const { setGraphFromJson, username, setUser, setLoadGraph, setStoreGraph, setFileLoaded, removeVisits } = useGraphStore();
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
        setAddNode(false);
        setAddEdge(false);
    };

    const handleClickAddNode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setAddNode(!addNode);
        setAddEdge(false);
        scrollToForm();
    };

    const handleClickAddEdge = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setAddEdge(!addEdge);
        setAddNode(false);
        scrollToForm();
    };

    const handleClickLogOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setUser(null);
        localStorage.removeItem("username");
    };

    const handleClickLogIn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleClickLoadGraph = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoadGraph(true);
        setStoreGraph(false);
    };

    const handleClickSaveGraph = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setStoreGraph(true);
        setLoadGraph(false);
    };

    const handleClickDeleteGraph = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        deleteGraph();
        setFileLoaded(false);
    
    };

    const scrollToForm = () => {
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50); // Ajusta el valor del retraso según sea necesario
    };

    return (
        <div className="bg-gray-700 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <button onClick={handleClickLoadData} className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-500 bg-transparent hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                        <FiUpload className="mr-2" /> FILE
                    </button>
                    <button onClick={handleClickAddNode} className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-500 bg-transparent hover:bg-green-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
                        <FiPlus className="mr-2" /> ADD NODE
                    </button>
                    <button onClick={handleClickAddEdge} className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-500 bg-transparent hover:bg-yellow-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500">
                        <FiPlus className="mr-2" /> ADD EDGE
                    </button>
                    <button onClick={handleClickLoadGraph} className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500">
                        <FiUpload className="mr-2" /> LOAD GRAPH
                    </button>
                    <button onClick={handleClickSaveGraph} className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-500 bg-transparent hover:bg-orange-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500">
                        <FiUpload className="mr-2" /> SAVE GRAPH
                    </button>
                    <button onClick={handleClickDeleteGraph} className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-500 bg-transparent hover:bg-purple-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500">
                        <FiTrash2 className="mr-2" /> DELETE GRAPH
                    </button>
                </div>
                <div>
                    {username ?
                        <button onClick={handleClickLogOut} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-500 bg-transparent hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                            <FiLogOut className="mr-2" /> log out
                        </button>
                        :
                        <button onClick={handleClickLogIn} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-500 bg-transparent hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                            <FiLogIn className="mr-2" /> log in
                        </button>
                    }
                </div>
            </div>
            <div ref={formRef}>
                {addNode && !addEdge ? <FormNode /> : <></>}
                {addEdge && !addNode ? <FormEdge /> : <></>}
            </div>
        </div>
    )
}

export default Navbar;
