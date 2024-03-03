import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

const CameraQR: React.FC = () => {
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const navigate = useNavigate();
  const [cameraApp, setCameraApp] = useState<boolean>(false);
  const [data, setData] = useState<string>('');
  const [name, setName] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    let identifier: string | null = null;
    const generateQRAndToken = async () => {
      try {
        const response = await axios.get<{ imageQr: string; token: string }>('http://localhost:3000/camera/generate-qr');
        setQrImageUrl(response.data.imageQr);
        localStorage.setItem('token', response.data.token);
        identifier = response.data.token;
        socketRef.current!.emit('conectado', { token: identifier, type: 'qr' });
      } catch (error) {
        console.error('Error al generar el QR y el token:', error);
      }
    };

    const fetchToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get<{ validate: boolean; imageQr: string }>(`http://localhost:3000/camera/validate-token/${token}`);
          if (response.data.validate === true) {
            identifier = token;
            socketRef.current!.emit('conectado', { token: identifier, type: 'qr' });
            return response.data.imageQr;
          }
          return null;
        } catch (error) {
          console.error('Error al validar el token:', error);
          return null;
        }
      }
      return null;
    };

    const loadQRImage = async () => {
      const imageQr = await fetchToken();
      if (imageQr) {
        setQrImageUrl(imageQr);
      } else {
        generateQRAndToken();
      }
    };

    socketRef.current!.on('logueado', (data : {token : string, name: string}) => {
      if (identifier !== data.token) return -1;
      setCameraApp(true);
      setName(data.name);
      setData(`conexion establecida ${data.name ? ` - ${data.name}` : ''}`);
      setTimeout(() => {
        setData('');
      }, 2000); 
    });
    socketRef.current!.on('logout', (data : {token : string})=> {
      console.log(data.token, identifier);
      if (identifier !== data.token) return -1;
      setName('');
      setCameraApp(false);
    });
    socketRef.current!.on('withoutTrack', async (data : {token : string, type: string, name: string})=> {
      if (identifier !== data.token) return -1;
      const message_type = data.type;
      if (message_type === 'withoutTrack') {
        setData(`acabado el registro de cara`);
        setTimeout(() => {
          setData('');
        }, 2000);
      }
    });

    socketRef.current!.on('onTrack', async (data : {token : string, type: string}) => {
      if (identifier !== data.token) return -1;
      const message_type = data.type;
      if (message_type === 'onTrack') {
        setData(message_type);
      }
    });
    
    socketRef.current!.on('conectado', async(data : {token : string, type: string, name: string})=> {
      if (identifier !== data.token) return -1;
      if(data.type === 'app'){
        setCameraApp(true);
        setName(data.name);
        setData(`conexion establecida ${data.name ? ` - ${data.name}` : ''}`);
        setTimeout(() => {
          setData('');
        }, 2000);
      }
    });

    loadQRImage();

  }, []);


  return (
    <div className='bg-red-800 h-full'>
      <div className="flex items-center justify-start p-4">
        <IoHomeOutline
          onClick={() => navigate('/')}
          className="text-gray-300 text-3xl ml-4 rounded-md border mt-4 border-gray-300 p-1 cursor-pointer  hover:bg-red-900 hover:text-white"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {
          !cameraApp ? (
            <div className="bg-white p-8 rounded-lg shadow-md w-60 h-60">
              {qrImageUrl && <img src={qrImageUrl} alt="QR Code" />}
            </div>
          ) : (

            data.length > 0 && (<div>
              <h2 className='text-white'>{data}</h2>
            </div>)
          )
        }
      </div>
    </div>
  );
};

export default CameraQR;
