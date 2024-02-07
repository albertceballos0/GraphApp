import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import useGraphStore from '../store';
import { useNavigate } from 'react-router-dom';


interface FormData{
    username: string,
    password:string, 
}


const FormRegister : React.FC = () => {

  const  { setUser, username }  = useGraphStore();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/register', formData);
      console.log(response.data)
      if(!response.data.register){
            setError(response.data.message)
      }else {
        setError(null);
        setUser(formData.username);
        localStorage.setItem("username", formData.username);
        navigate('/');
      }
     
    } catch (err) {
        console.error("Error al registrarse", err);
    }
  };
  const handleClickLogin = (e) => {
    navigate('/login');
  }

  return (

          <>
            <h2 className="text-2xl font-semibold text-center mb-4 text-blue-500">Regístrate</h2>
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
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registrarse
              </button>
            </form>
            <p className="text-center mt-4 text-sm text-gray-600">
              ¿Ya tienes una cuenta? <button onClick={handleClickLogin} className="text-blue-500 focus:outline-none underline hover:text-blue-800">Inicia sesión aquí</button>
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </>
  );
}

export default FormRegister;
