import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { IoHomeOutline, IoTrash, IoReturnDownBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

const CameraQR: React.FC = () => {
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const navigate = useNavigate();
  const [cameraApp, setCameraApp] = useState<boolean>(false);
  const [data, setData] = useState<{message: string, color:string} | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string | null>(null);
  const [files, setFiles] = useState<{name: string}[]>([]);
  const [onTrack, setOntrak] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<{id: number, name: string} | null>(null);
  const [mouseOver, setMouseOver] = useState<{id: number, name: string} | null>(null);
  const socketRef = useRef<Socket | null>(null);


  useEffect(() => {
    const fetchFiles = async () => {
      if (!name) return;
      if(onTrack) return;
      console.log("hola")
      const userId = await axios.get(`http://localhost:3000/users/userId/${name}`);
      const response = await axios.get<{ faces: { id: number; name: string; userId: string }[] }>(`http://localhost:3000/filerecognition/getfiles/${userId.data.user}`);
      console.log(response?.data.faces);
      setFiles(response?.data.faces);
    }
    const fetchData = async () => {
      await fetchFiles();
    };
  fetchData();
  }, [name, onTrack]);
  
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
      setLoading(true);
      setTimeout(() => {
        if (imageQr) {
          setQrImageUrl(imageQr);
        } else {
          generateQRAndToken();
        }
        setLoading(false);
      }, 800);
    };

    socketRef.current!.on('logueado', (data : {token : string, name: string}) => {
      if (identifier !== data.token) return -1;
      setCameraApp(true);
      setName(data.name);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 800); 
    });
    socketRef.current!.on('logout', (data : {token : string})=> {
      console.log(data.token, identifier);
      if (identifier !== data.token) return -1;
      setName(null);
      setCameraApp(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 800); 
    });
    socketRef.current!.on('withoutTrack', async (data : {token : string, type: string, name: string})=> {
      if (identifier !== data.token) return -1;
      const message_type = data.type;
      if (message_type === 'withoutTrack') {
        setOntrak(false);
      }
    });
    socketRef.current!.on('onTrack', async (data : {token : string, type: string}) => {
      if (identifier !== data.token) return -1;
      const message_type = data.type;
      if (message_type === 'onTrack') {
        setOntrak(true);
      }

    });
    
    socketRef.current!.on('conectado', async(data : {token : string, type: string, name: string})=> {
      if (identifier !== data.token) return -1;
      if(data.type === 'app'){
        setCameraApp(true);
        setName(data.name);

      }
    });

    loadQRImage();

    return () => {
      if(socketRef.current) socketRef.current.close();
    };

  }, []);
  
  const handleDeleteFile = async () => {
    if (!mouseOver) return;
    const response = await axios.get(`http://localhost:3000/filerecognition/deletefile/${mouseOver.name}`);
    console.log(response.data, mouseOver.name);
    if (response.data.deleted) {
      const newFiles = files.filter((_, index) => index !== mouseOver.id);
      setFiles(newFiles);
      setMouseOver(null);
      if(selectedItem?.id === mouseOver.id) setSelectedItem(null);
    }

  };
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-slate-900 flex items-center justify-center">
        <p className="text-white text-2xl">Cargando...</p>
      </div>
    );
  }
  return (
    <div className='h-screen'>
        {
          !cameraApp ? (
           <div className='bg-slate-900'> 
              <div className="flex justify-start p-4">
              <IoHomeOutline
                onClick={() => navigate('/')}
                className="text-gray-300 text-3xl ml-4 rounded-md border mt-4 border-gray-300 p-1 cursor-pointer  hover:bg-slate-900 hover:text-white"
              />
              </div>
                <div className="flex items-center justify-center min-h-screen ">
                  <div className="bg-white p-8 rounded-lg shadow-md w-60 h-60">
                    {qrImageUrl && <img src={qrImageUrl} alt="QR Code" />}
                  </div>
              </div>
          </div>
          ) : 
            <div>
              <div className='flex items-center justify-between px-4 py-8 bg-slate-900'>
                <IoHomeOutline
                  onClick={() => navigate('/')}
                  className="text-gray-300 p-1 border-gray-300 text-3xl rounded-md border cursor-pointer hover:border-slate-900 hover:bg-slate-500 hover:text-slate-900"
                />
                <h1 className='text-lg font-semibold text-gray-300'>GraphhApp - {name}</h1>
              </div>
             {onTrack ? 
                    (<div className="flex items-center justify-center min-h-screen ">
                         <h1> onTrack</h1>
                    </div>)
              :
                <div className='flex flex-row h-screen items-stretch justify-between'>
                  <div className='overflow-auto w-1/2 border-r border-black'>
                    <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full">
                      <tbody>
                        {files.map((file, index) => (
                          <tr
                            onDoubleClick={() => setSelectedItem({ id: index, name: file.name })}
                            onMouseOver={() => setMouseOver({ id: index, name: file.name })}
                            className={`${(selectedItem?.id === index || mouseOver?.id === index) ? 'font-bold  bg-gray-100' : ''}`} key={index}>
                            <th scope="row" className={`px-6 py-4 font-medium text-gray-900 whitespace-nowrap cursor-pointer h-16`}>
                              {file.name}
                            </th>
                            <td className='px-6 py-4 flex justify-end h-16'>
                              <IoTrash
                                onClick={handleDeleteFile}
                                className='ml-2 border rounded-md text-3xl p-1 hover:bg-red-600 hover:text-white cursor-pointer' />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>


                  {
                  selectedItem ?    
                  <div className='w-1/2 max-h-full'>
                    <div className=' h-1/6 p-4 bg-slate-600 flex items-center justify-between'>
                      <IoReturnDownBack
                              onClick={() => setSelectedItem(null)}
                              className="text-gray-300 p-1 border-gray-300 text-3xl rounded-md border cursor-pointer hover:border-slate-900 hover:bg-slate-500 hover:text-slate-900"
                      />
                      <h1 className='uppercase'>{selectedItem.name}</h1>
                      <div></div> {/* Div vacío para mantener el espacio a la izquierda */}
                    </div>        
                    <div className=' h-5/6 flex flex-col justify-center items-center bg-gray-200'>  
                      <button className='w-1/3 mb-5 text-gray-700 bg-gray-400 border p-2 rounded-md border-gray-500 hover:bg-gray-700 hover:text-white'>
                            Ver modelo
                      </button>
                      <button className=' w-1/3 mt-5 text-gray-700 border bg-gray-400 p-2 rounded-md border-gray-500 hover:bg-gray-700 hover:text-white'>
                            Empezar reconocimiento
                      </button>
                    </div>
                    </div> :
                    <div className='md:w-1/2 flex items-center justify-center'> 
                      <h1>HOOOLAAAA</h1>
                    </div>
                  }                  
                  </div>
            }
            </div>
                        
       }
      </div>
  );
};

export default CameraQR;
