import  { useState, useEffect } from 'react';

import axios from 'axios';
import useGraphStore from '../store';
import { convertirTextoAJSON } from '../hooks/utilities';
const LoadGraph = () => {
  const [apiData, setApiData] = useState<string[]>([]);
  const [personalGraphs, setPersonalGraphs] = useState<string[]>([]);
  const {username } = useGraphStore();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [mouseOver, setMouseOver] = useState<number | null>(null);
  const { setLoadGraph , setGraphFromJson, removeTrack,setFileLoaded, removeVisits, track, visits} = useGraphStore();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/graph/files');
        setApiData(response.data);
        if(username){
          try{
            const response = await axios.get(`http://localhost:3000/graph/files/${username}`);
            setPersonalGraphs(response.data);
          }catch(err){
            console.error('Error fetching data:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    e.preventDefault();
    setLoadGraph(false);
    if(!selectedItem) return;
    try{
        const response = await axios.get(`http://localhost:3000/graph/${selectedItem}`);
        const myjson = convertirTextoAJSON(response.data);
        if (visits.length > 0) removeVisits();
        if(track.length > 0) removeTrack();
        setGraphFromJson(myjson); 
        setFileLoaded(true); 
    }
    catch(err){
        console.error("Error cargando grafo del server");
    }


};
  return (
<div className="bg-white p-4 border border-gray-300 rounded-md shadow-md flex justify-center" style={{ width: '600px' }}>
    <div className={`${username  ? 'w-1/2' : 'w-full'}` }>
      <h2 className="text-xl font-semibold mb-4">Grafos por defecto:</h2>
      <ul className="max-h-80 overflow-y-auto space-y-2 w-full">
        {apiData.map(item => (
        <li
          onClick={() => setSelectedItem(item.id)}
          onMouseOver={() => setMouseOver(item.id)}
          onDoubleClick={handleSubmit}
          key={item.id}
          className={`cursor-pointer ${(selectedItem === item.id || mouseOver === item.id) ? 'font-bold bg-gray-100'  : ''}  p-2 rounded-md hover:bg-gray-100 transition-colors duration-150`}
        >
          <span className="text-blue-500">{item.nodos}</span> <span className="text-gray-500">/</span> <span className="text-blue-500">{item.aristas}</span>
        </li>
        ))}
      </ul>
    </div>
    {
      username ?  
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">Mis Grafos:</h2>
          <ul className="max-h-80 overflow-y-auto space-y-2 w-full">
              {personalGraphs.map(item => (
              <li
                  onClick={() => setSelectedItem(item.id)}
                  onMouseOver={() => setMouseOver(item.id)}
                  onDoubleClick={handleSubmit}
                  key={item.id}
                  className={`cursor-pointer ${(selectedItem === item.id || mouseOver === item.id) ? 'font-bold bg-gray-100'  : ''}  p-2 rounded-md hover:bg-gray-100 transition-colors duration-150`}
              >
                  <span className="text-blue-500">{item.nodos}</span> <span className="text-gray-500">/</span> <span className="text-blue-500">{item.aristas}</span>
              </li>
              ))}
          </ul>
        </div>
        : <></>
    }
</div>


  );
};

export default LoadGraph;
