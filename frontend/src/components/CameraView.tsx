import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import io, {Socket } from 'socket.io-client';
import useGraphStore from '../store';
import { IoLogOut } from 'react-icons/io5';

interface FormData {
  name: string;
}

const CameraView: React.FC<{ handleLogOut: () => void; token: string }> = ({ handleLogOut, token }) => {
  const myVideo = useRef<HTMLVideoElement>(null);
  const [formularioModelo, setFormularioModelo] = useState(false);
  const socket = useRef<Socket>();
  const pcRef = useRef<RTCPeerConnection>();
  const { username } = useGraphStore();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(true);
  const formularioModeloRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
  });
  const [errorFormulario, setErrorFormulario] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formularioModeloRef.current && !formularioModeloRef.current.contains(event.target as Node)) {
        setFormularioModelo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);


    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    socket.current = io('http://localhost:3000');
    pcRef.current = new RTCPeerConnection();

    socket.current.emit('prepared', { message: 'js' });

    const startMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setMediaStream(stream);
        if (myVideo.current) myVideo.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    const fetchMediaDevices = async () => {
      await startMediaStream();
    };

    fetchMediaDevices();

    const handleAnswer = async (data: {token : string, type: string, sdp:string}) => {
      if (pcRef.current?.connectionState !== 'new') {
        console.log('Peer connection is already connected.');
        return;
      }
      try {
        if (!pcRef.current) {
          pcRef.current = new RTCPeerConnection();
        }
        const answer = new RTCSessionDescription(data);
        await pcRef.current.setRemoteDescription(answer);
        console.log("answer tramitada correctamente");
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    };

    socket.current.on('message', async (data: {token : string, type: string, sdp:string}) => {
      if (data.token !== token) return;
      const message_type = data.type;
      if (message_type === 'answer') {
        await handleAnswer(data);
        socket.current?.emit('confirm', { type: 'confirm', token });
      }
    });

    socket.current.on('onTrack', async (data: {token: string}) => {
      if (data.token !== token) return;
      setConnected(true);
      setMensaje("generando imagenes");
    });

    socket.current.on('withoutTrack', async (data: {token: string}) => {
      if (data.token !== token) return;
      setConnected(false);
      setMensaje('');
      pcRef.current?.close();
      pcRef.current = new RTCPeerConnection();
    });

    socket.current.on('prepared', async (data: {message: string}) => {
      if (data.message === 'js') return;
      console.log("prepared");
      setConnected(false);
    });
    socket.current.on('conectado', (data) => {
      console.log("conectado", data, username);
      if (token !== data.token) return -1;
      if (username && data.type === 'qr') {
        socket.current?.emit('conetado', {token : token, type: 'app'});
      }
    });
    return (() => {
      if (mediaStream) {
        console.log("limpiando");
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    });

  }, []);

  const handleClickLogOut = async () => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => track.stop());
    }
    if (pcRef.current) {
      await pcRef.current.close();
    }
    handleLogOut();
  };

  const handleOffer = async (name: string) => {
    if (pcRef.current?.connectionState !== 'new') {
      console.log('Peer connection is already connected.');
      return;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(async (track) => {
        await pcRef.current?.addTrack(track, mediaStream);
      });
      const offer = await pcRef.current?.createOffer();
      await pcRef.current?.setLocalDescription(offer);
      console.log(token);
      socket.current?.emit('message', { type: 'offer', sdp: pcRef.current?.localDescription?.sdp, token, name });
    }
  };

  const crearModelo = () => {
    setFormularioModelo(true);
  };

  const handleSubmitCrearModelo = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (formData.name.length === 0) {
      setErrorFormulario('No puede estar vacio');
      return;
    }
    setFormularioModelo(false);
    await handleOffer(formData.name);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      name: e.target.value
    });
  };

  return (
    <div className='h-screen flex flex-col bg-white'>
      <div className="flex items-center justify-between px-4 py-8 bg-red-900 text-white">
        <h1 className="text-lg font-semibold">GraphApp - {username}</h1>
        <IoLogOut onClick={handleClickLogOut} className="text-red-500 text-3xl rounded-md border border-red-500 hover:border-black hover:text-black focus:outline-none" />
      </div>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="md:w-1/2 lg:w-1/3 border-3 border-gray-700 rounded-md overflow-hidden">
          <video ref={myVideo} autoPlay muted className="w-full" />
        </div>
        <div className="flex flex-col mt-8 w-3/4 md:w-1/2 lg:w-1/2">
          {!connected && mediaStream && (
            <button onClick={crearModelo} className="bg-red-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition-colors duration-300 mb-4">
              Crear modelo
            </button>
          )}
          {!connected && mediaStream && (
            <button onClick={crearModelo} className="bg-red-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition-colors duration-300">
              Crear modelo
            </button>
          )}
        </div>
        {mensaje && <p className="mt-8 text-green-500 text-sm ">{mensaje}</p>}
      </div>
      {formularioModelo && mediaStream && (
        <div ref={formularioModeloRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white p-6 border border-gray-300 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Nombre del usuario a registrar</h2>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.name}
              onChange={handleChange}
              className="rounded-md mb-4 border-2 w-full hover:border-gray-500 focus:border-red-600 focus:outline-none"
              placeholder="ingrese su nombre"
              required
            />
            <button onClick={handleSubmitCrearModelo} className="bg-red-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition-colors duration-300">
              crear modelo
            </button>
            {errorFormulario && <p className="text-red-500 text-sm mt-2">{errorFormulario}</p>}

          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
