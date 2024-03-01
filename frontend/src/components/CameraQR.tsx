import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import io from 'socket.io-client';

const CameraQR = () => {
  const [qrImageUrl, setQrImageUrl] = useState('');
  const navigate = useNavigate();
  const [cameraApp, setCameraApp] = useState(false);
  const [data, setData] = useState('');
  
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    let identifier: string | null = null;
    const generateQRAndToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/camera/generate-qr');
        setQrImageUrl(response.data.imageQr);
        localStorage.setItem('token', response.data.token);
        identifier = response.data.token;
        socketRef.current.emit('conectado', { token : identifier});
      } catch (error) {
        console.error('Error al generar el QR y el token:', error);
      }
    };

    const fetchToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`http://localhost:3000/camera/validate-token/${token}`);
          if (response.data.validate === true) {
            identifier = token;
            socketRef.current.emit('conectado', { token : identifier});

            return response.data.imageQr;
          }
        } catch (error) {
          console.error('Error al validar el token:', error);
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
    loadQRImage();

    

    socketRef.current.on('logueado', (data) => {
      if(identifier !== data.token) return -1;
      setCameraApp(true);
      setData('conexion establecida');
    }); 
    socketRef.current.on('logout',  (data) => {
      console.log(data.token, identifier);
      if(identifier !== data.token) return -1;
      setCameraApp(false);
    }); 
    socketRef.current.on('withoutTrack', async (data) => {
      if(identifier !== data.token) return -1;
      const message_type = data.type;
      if (message_type === 'withoutTrack')
      {
        setData(message_type);
      }
    });

    socketRef.current.on('onTrack', async (data) => {
      if(identifier !== data.token) return -1;
      const message_type = data.type;
      if(message_type === 'onTrack'){
        setData(message_type);
      }
    });
    socketRef.current.on('conectado', async (data) => {
      if(identifier !== data.token) return -1;
        setCameraApp(true);
        setData('conexion establecida');

    });
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
            <div>
              <h2 className='text-white'>{data}</h2>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CameraQR;
