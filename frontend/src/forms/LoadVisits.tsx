

import  { useState, ChangeEvent } from 'react';
import useGraphStore from '../store';

interface FormData {
    source: string;
    target: string;
    visits: number;
  }
  

const LoadVisits = () => {

    const { setLoadVisits, mygraph ,setVisits, removeVisits, removeTrack, visits, track } = useGraphStore();

    const NodeOptions = mygraph.nodes();
    const nodos: string[] = Array.from(NodeOptions);

    const [formData, setFormData] = useState<FormData>({
        source: nodos[0],
        target: nodos[1],
        visits:1,
    });
  
    const handleChangeSource = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            source: value,
          }));  };
    
    const handleChangeTarget= (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            target: value,
        }));  };
    const handleClickIncrement= (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(formData.visits === nodos.length - 2)
            return;
        setFormData((prevData) => ({
            ...prevData,
            visits: formData.visits + 1,
        }));
    };
    const handleClickDecrement= (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(formData.visits === 1)
            return;
        setFormData((prevData) => ({
            ...prevData,
            visits: formData.visits - 1,
        }));
    };
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (visits.length > 0) removeVisits();
        if(track.length > 0) removeTrack();
        setVisits(formData.source, formData.target, formData.visits);
        setLoadVisits(false);
    };
    const handleChangeVisits = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            source: value,
          }));  
    };
    
  return (
    <div className="bg-white p-4 border border-gray-300 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Seleccionar el numero de visitas: </h2>
        
        <div className="flex items-center">
            <input
                type="number"
                className="border border-gray-300 rounded-md p-2 text-center w-20"
                value={formData.visits}
                onChange={handleChangeVisits}
            />
            <button className="px-3 py-1 bg-gray-200 rounded-md ml-2" onClick={handleClickIncrement}>
                ▲
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded-md ml-2" onClick={handleClickDecrement}>
                ▼
            </button>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-gray-700" htmlFor="source">
              Nodo Fuente:
            </label>
            <select className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50" value={formData.source} onChange={handleChangeSource}>
              {nodos.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-gray-700" htmlFor="target">
              Nodo Destino:
            </label>
            <select className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50" value={formData.target} onChange={handleChangeTarget}>
              {nodos.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button 
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
            Cargar Gráfico
        </button>
    </div>
  )
}

export default LoadVisits