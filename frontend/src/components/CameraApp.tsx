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
                await axios.get(`${import.meta.env.VITE_API_URL}/camera/token-free/${token}/${username}`);
                socket.current?.emit('logueado', { 'name': username, 'token': token });
                return true;
              }
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
        <p className="text-white text-2xl">Cargando...</p>
      </div>
    );
  }
  return (
    <div>
      {validToken ? (
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
      ) : (
        <div>
          <h2>Token no válido</h2>
          {/* Aquí puedes mostrar el contenido después de iniciar sesión */}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CameraApp;
