import React, { useState, ChangeEvent } from 'react';
import {useSigma} from '@react-sigma/core'; 
import Error from '../components/Error';


interface FormData {
  source: string;
  target: string;
  weight: number;
}


const FormEdge: React.FC = () => {

  const sigma = useSigma();
  const [error, setError] = useState<string | null>(null);
  
  const NodeOptions = sigma.getGraph()._nodes.keys();
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
    const label = `${source} => ${target}`;
    const size= 5;

    if(weight < 0){
        setError('peso negativo');
        return ;

    }
    const NodeOptions = sigma.getGraph()._edges.values();
    const edges: string[] = Array.from(NodeOptions);
    

    const edgeExists = edges.some((edge) => edge.source.key === source && edge.target.key === target);
    const edgeReverse = edges.some((edge) => edge.source.key === target && edge.target.key === source);

    // Si la arista ya existe, mostrar un error
    if (edgeExists || edgeReverse) {
        setError('¡Ya existe esta arista!');
        return;
    }

    try{
        sigma.getGraph().addEdge(source, target, { tipo, label,size, weight });
        setError(null);

    }
    catch(error){
        setError('error añadiendo arista');
    }


  };

  return (
    <div className="mt-10 bg-gray-200 ml-20 mr-20 px-4 py-2 border border-black rounded-md ">
    <form onSubmit={handleSubmit}>
      <div className='flex mt-2'>
        <label className='w-1/3 justify-center text-center' htmlFor="source">Nodo Fuente:</label>
        <select className='w-full' value={formData.source} onChange={handleChangeSource}>
          {nodos.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
      </div>
      <div className='flex mt-2'>
        <label className='w-1/3 justify-center text-center' htmlFor="target">Nodo Destino:</label>
        <select className='w-full' value={formData.target} onChange={handleChangeTarget}>
          {nodos.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
      </div>
      <div className='flex mt-2'>
        <label className='w-1/3 justify-center text-center' htmlFor="weight">Peso:</label>
        <input className='w-full'
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />
      </div>
      <button className = 'w-full mt-3 hover:bg-gray-600 hover:text-white border border-black rounded-md'type="submit">AGREGAR ARISTA</button>
    </form>
    {
        error ? <Error> {error} </Error> : <></>
    }
    </div>
  );
};

export default FormEdge;
