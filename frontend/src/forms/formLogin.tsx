import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import useGraphStore from '../store';
import { useNavigate } from 'react-router-dom';


interface FormData{
    username: string,
    password:string, 
}


const FormLogin : React.FC = () => {

  const  { setUser }  = useGraphStore();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, formData);
      if(!response.data.acces){
            setError(response.data.message)
      }else {
        setError(null);
        setUser(formData.username);
        localStorage.setItem("username", formData.username);

      }
     
    } catch (err) {
        console.error("Error al iniciar sesión", err);
    }
  };
  
  const handleClickRegistro = () => {
    navigate('/register');
  }

  return (

<>
    <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Iniciar sesión</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Nombre de usuario
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
          placeholder="Ingrese su nombre de usuario"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
          placeholder="Ingrese su contraseña"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Iniciar sesión
      </button>
    </form>
    <p className="text-center mt-4 text-sm text-gray-600">
      ¿No tienes una cuenta? <button onClick={handleClickRegistro} className="text-gray-900 underline focus:outline-none hover:text-gray-300">Regístrate aquí</button>
    </p>
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  );
}

export default FormLogin;
