import  { useState, ChangeEvent } from 'react';
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

  const {mygraph, addNode } = useGraphStore();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    size: 7,
    color: SizeColorOptions[7][0],
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

    if(mygraph.hasNode(name)){
      setError("¡ya existe este nodo!");
      return;
    }
    const angle = (1 * 2* Math.PI) / mygraph.order;
    const x =  100 * Math.cos(angle);
    const y =  100 * Math.sin(angle);
    try{

        addNode(name, { size,color, x, y});
        setError(null);

      }
    catch (error){
        console.log(error);
        setError('error añadiendo nodo');

    }

  };

  return (
    <div className="mt-10 bg-gray-300 ml-20 mr-20 px-4 py-2 border border-green-500 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-gray-700" htmlFor="name">
              Nombre:
            </label>
            <input
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-gray-700" htmlFor="size">
              Tamaño:
            </label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData.size}
              onChange={handleSizeChange}
            >
              {[15, 7].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-gray-700" htmlFor="color">
              Color:
            </label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData.color}
              onChange={handleChange}
            >
              {SizeColorOptions[formData.size].map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600"
            type="submit"
          >
            AGREGAR NODO
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>


  );
};

export default FormNode;
