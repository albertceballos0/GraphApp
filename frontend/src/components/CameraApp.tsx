import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FormLogin from '../forms/formLogin';
import CameraView from './CameraView';
import useGraphStore from '../store';
import io, { Socket } from 'socket.io-client';


const CameraApp: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { username, setUser } = useGraphStore();
  const [validToken, setValidToken] = useState<boolean | null>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const socket = useRef<Socket>();

  useEffect(() => {

    socket.current = io(`${import.meta.env.VITE_SOCKET_URL}`);
    const fetchToken = async () => {
      console.log(username);
      try {
        if (token) {
          
          const response = await axios.get<{ validate: boolean; users: number }>(`${import.meta.env.VITE_API_URL}/camera/validate-token/${token}`);
          console.log(response.data);
          const userId = await axios.get<{ user: number}>(`${import.meta.env.VITE_API_URL}/users/userId/${username}`);
          if (response.data.validate === true) {
            if (!username) {
              if (response.data.users === 0) return true;
              else {
                setError("Usuario ocupando token");
                return false;
              }
            } else {
              if (response.data.users === 0) {
                console.log(username);
                await axios.get(`${import.meta.env.VITE_API_URL}/camera/token-free/${token}/${username}`);
                socket.current?.emit('logueado', { 'name': username, 'token': token });
                return true;
              }
              console.log("HOLA")
              //si es el mismo usuario que tiene el token puede permitir conectarse al token con el mismo usuario a la vez 
              if (response.data.users === userId.data.user) {
                socket.current?.emit('logueado', { 'name': username, 'token': token });
                return true;
              }
              setError("Usuario ocupando token");
              return false;
            }
          } else {
            setError("Token ha expirado");
            return false;
          }
        } else {
          console.log('No hay token error de pagina ');
          setError("No hay token error de pagina ");
          return false;
        }
      } catch (error) {
        console.error('Error al validar el token:', error);
        return false;
      }
    };

    const fetchData = async () => {
      setLoading(true); // Indicar que se está cargando
      const res = await fetchToken();
      setTimeout(() => {
        setValidToken(res);
        setLoading(false); // Indicar que la carga ha terminado después de 2 segundos
      }, 800); // 2000 milisegundos = 2 segundos
    };

    fetchData();
    socket.current.on('conectado', (data) => {
      if (token !== data.token) return -1;
        if (username && data.type === 'qr') {
          socket.current?.emit('conectado', {token : token, type: 'app', name: username});
        }
    });
    const liberar = async () =>{
      await axios.get(`${import.meta.env.VITE_API_URL}/camera/liberarToken/${token}`);
      socket.current?.emit('logout', { 'token': token });
    }
    return (() => {
      liberar();
      socket.current?.close();
    });

  
  }, [username]);

  const handleLogOut = async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}/camera/liberarToken/${token}`);
    setUser(null);
    socket.current?.emit('logout', { 'token': token });
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-red-800 flex items-center justify-center">
        <p className="text-white text-2xl">Cargando</p>
        <svg aria-hidden="true" role="status" className="ml-4 inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
      </div>
    );
  }
  return (
    <div className='h-screen'>
      {validToken && (
        !username ? (
          <div className="bg-gray-800 h-full">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="bg-white p-8 rounded-lg shadow-md w-80">
                <FormLogin />
              </div>
            </div>
          </div>
        ) : (
          <CameraView token={token} handleLogOut={handleLogOut} />
        )
      )}
      {error && (
        <div className='h-full flex items-center justify-center'>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>)}
    </div>
  );
};

export default CameraApp;
