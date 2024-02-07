import  { useState, useEffect, FormEventHandler } from 'react';

import axios from 'axios';
import useGraphStore from '../store';
import { convertirTextoAJSON } from '../hooks/utilities';
const LoadGraph = () => {
  const {setFileLoaded} = useGraphStore();
  const [apiData, setApiData] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [mouseOver, setMouseOver] = useState<number | null>(null);
  const { setLoadGraph , setGraphFromJson} = useGraphStore();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/graph/files');
        setApiData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    e.preventDefault();
    setLoadGraph(false);

    try{
        const response = await axios.get(`http://localhost:3000/graph/${selectedItem}`);
        const myjson = convertirTextoAJSON(response.data);
    
        setGraphFromJson(myjson); 
        setFileLoaded(true); 
    }
    catch(err){
        console.error("Error cargando grafo del server");
    }


};
  return (
    <div className="bg-white p-4 border border-gray-300 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Seleccionar datos para el gráfico:</h2>
        
        <ul className="space-y-2">
            {apiData.map(item => (
            <li
                onClick={() => setSelectedItem(item.id)}
                onMouseOver={() => setMouseOver(item.id)}
                key={item.id}
                className={`cursor-pointer ${(selectedItem === item.id || mouseOver === item.id) ? 'font-bold bg-gray-100'  : ''}  p-2 rounded-md hover:bg-gray-100 transition-colors duration-150`}
            >
                <span className="text-blue-500">{item.nodos}</span> <span className="text-gray-500">/</span> <span className="text-blue-500">{item.aristas}</span>
            </li>
            ))}
        </ul>
        <button 
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
            Cargar Gráfico
        </button>
    </div>
  );
};

export default LoadGraph;
