import React, { useState, ChangeEvent } from 'react';
import Error from '../components/Error';
import useGraphStore from '../store';

interface FormData {
  name: string;
  size: number;
  color: string;
}

const SizeColorOptions: { [key: number]: string[] } = {
  15: ['red', 'blue'],
  7: ['green'],
};

const FormNode: React.FC = () => {
  const [error, setError] = useState<string | null>(null)

  const {mygraph } = useGraphStore();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    size: 15,
    color: SizeColorOptions[15][0],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    const allowedColors = SizeColorOptions[newSize];
    setFormData((prevData) => ({
      ...prevData,
      size: newSize,
      color: allowedColors[0], // Set the first allowed color by default
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, color, size} = formData;

    const angle = (1 * 2* Math.PI) / mygraph.order;
    const x =  100 * Math.cos(angle);
    const y =  100 * Math.sin(angle);

    try{
        mygraph.addNode(name, { size, name, color, x, y});
        setError(null);
    }
    catch (error){
        console.log(error);
        setError('error añadiendo nodo');

    }


  };

  return (
    <div className="mt-10 bg-gray-200 ml-20 mr-20 px-4 py-2 border border-black rounded-md ">
        <form onSubmit={handleSubmit}>
        <div className='flex mt-2'>
            <label className='w-1/3 justify-center text-center' htmlFor="name">Nombre:</label>
            <input className='w-full'
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            />
        </div>
        <div className='flex mt-2'>
            <label className='w-1/3 justify-center text-center' htmlFor="size">Tamaño:</label>
            <select className='w-full' value={formData.size} onChange={handleSizeChange}>
            {[15, 7].map((size) => (
                <option key={size} value={size}>
                {size}
                </option>
            ))}
            </select>
        </div>
        <div className='flex mt-2'>
            <label className='w-1/3 justify-center text-center' htmlFor="color">Color:</label>
            <select className='w-full' value={formData.color} onChange={handleChange}>
            {SizeColorOptions[formData.size].map((color) => (
                <option key={color} value={color}>
                {color}
                </option>
            ))}
            </select>
        </div>
        <button className = 'w-full mt-3 hover:bg-gray-600 hover:text-white border border-black rounded-md'type="submit">AGREGAR NODO</button>
        </form>
        { error ? <Error> {error} </Error>  : <></>}
    </div>

  );
};

export default FormNode;
