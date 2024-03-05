import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoHomeOutline, IoTrash, IoReturnDownBack, IoSearch, IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

const CameraQR: React.FC = () => {
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const navigate = useNavigate();
  const [cameraApp, setCameraApp] = useState<boolean>(false);
  const [message, setMessage] = useState<{message: string, color:string} | null>(null);
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
      const userId = await axios.get(`${import.meta.env.VITE_API_URL}/users/userId/${name}`);
      const response = await axios.get<{ faces: { id: number; name: string; userId: string }[] }>(`${import.meta.env.VITE_API_URL}/filerecognition/getfiles/${userId.data.user}`);
      console.log(response?.data.faces);
      setFiles(response?.data.faces);
    }
    const fetchData = async () => {
      await fetchFiles();
    };
  fetchData();
  }, [name, onTrack]);
  
  useEffect(() => {

    socketRef.current = io(`${import.meta.env.VITE_SOCKET_URL}`);
    let identifier: string | null = null;
    const generateQRAndToken = async () => {
      try {
        const response = await axios.get<{ imageQr: string; token: string }>(`${import.meta.env.VITE_API_URL}/camera/generate-qr`);
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
          const response = await axios.get<{ validate: boolean; imageQr: string }>(`${import.meta.env.VITE_API_URL}/camera/validate-token/${token}`);
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
      setMessage({ message: `conectado - ${data.name}`, color: 'green' });
      setTimeout(() => {
        setLoading(false);
      }, 800); 
      setTimeout(() =>{
        setMessage(null);
      },3000);

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
        setMessage({ message: `cara registrada`, color: 'green' });
        setTimeout(() =>{
          setMessage(null);
        },3000);

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
        setMessage({ message: `conectado - ${data.name}`, color: 'green' });
        setTimeout(() =>{
          setMessage(null);
        },3000);
      }
    });

    loadQRImage();

    return () => {
      if(socketRef.current) socketRef.current.close();
    };

  }, []);
  
  const handleDeleteFile = async () => {
    if (!mouseOver) return;
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/filerecognition/deletefile/${mouseOver.name}`);
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
                            className={`${(selectedItem?.id === index || mouseOver?.id === index) ? 'font-bold  bg-gray-100' : ''} border-b border-gray-200 `} key={index}>
                            <th scope="row" className={`px-6 py-4 font-medium text-gray-900 whitespace-nowrap cursor-pointer h-16 `}>
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
                    <div className=' h-16 p-4 bg-slate-600 flex items-center justify-between'>
                      <IoReturnDownBack
                              onClick={() => setSelectedItem(null)}
                              className="text-gray-300 p-1 border-gray-300 text-3xl rounded-md border cursor-pointer hover:border-slate-900 hover:bg-slate-500 hover:text-slate-900"
                      />
                      <h1 className='uppercase'>{selectedItem.name}</h1>
                      <div></div> {/* Div vacío para mantener el espacio a la izquierda */}
                    </div>        
                    <div className='h-5/6 flex flex-col justify-center items-center'>  
                      <button className="mb-5 lowecase w-1/2 h-24 bg-gray-300 hover:bg-gray-600 hover:text-gray-200 transition duration-200 ease-in-out px-6 py-3  rounded-2xl shadow-lg">
                      <IoSearch className='inline text-2xl' /> ver modelo  
                      </button>
                      <button className="flex items-center flex-row mt-5 lowecase w-1/2 h-24 bg-gray-300 hover:bg-gray-600 hover:text-gray-200 transition duration-200 ease-in-out px-6 py-3  rounded-2xl shadow-lg">
                        <p className='w-5/6 '>empezar reconocimiento</p>
                        <IoChevronForward className='text-2xl w-1/3' />
                      </button>
                    </div>
                    </div> :
                    <div className=' h-1/2 w-1/2 flex items-center justify-center'> 
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
