import React, { useState, ChangeEvent, useEffect } from 'react';
import useGraphStore from '../store';
import { colorDefault } from '../hooks/utilities';

interface FormData {
  source: string;
  target: string;
  weight: number;
}


const FormEdge: React.FC = () => {

  const { mygraph, addEdge } = useGraphStore();
  const [error, setError] = useState<string | null>(null);

  const NodeOptions = mygraph.nodes();
  const nodos: string[] = Array.from(NodeOptions);

  const [formData, setFormData] = useState<FormData>({
    source: nodos[0],
    target: nodos[1],
    weight: 0,
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prevData) => ({
        ...prevData,
        weight: value,
      }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Puedes hacer algo con los datos del formulario aquí

    const { source, target, weight } = formData;
    if(source === target ) {
        setError('mismo origen y target');
        return ;
    }
    const tipo = 'lineal';
    const label = `edge`;
    const size= 1;

    if(weight < 0){
        setError('peso negativo');
        return ;

    }

    const edgeExists = mygraph.edges(source,target);
    const edgeReverse = mygraph.edges(target,source);

    // Si la arista ya existe, mostrar un error
    if (edgeExists.length> 0 || edgeReverse.length > 0) {
        setError('¡Ya existe esta arista!');
        return;
    }

    try{
        addEdge(source, target, { tipo, label,size, weight });
        setError(null);

        
    }
    catch(error){
        setError('error añadiendo arista');
        console.log(error)
    }

  };

  return (
    <div className="mt-10 bg-gray-200 ml-20 mr-20 px-4 py-2 border border-yellow-500 rounded-lg">
      <form onSubmit={handleSubmit}>
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
          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-gray-700" htmlFor="weight">
              Peso:
            </label>
            <input className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50" type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} />
          </div>
          <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600" type="submit">
            AGREGAR ARISTA
          </button>
        </div>
      </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>

  );
};

export default FormEdge;
