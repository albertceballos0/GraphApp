import { useState } from "react";
import { calcularChecksum, convertToJsonMygraph, convertirJSONATexto, createGraphFromJSON } from "../hooks/utilities";
import useGraphStore from "../store";
import axios from "axios";

const StoreGraph = () => {
   
  const [mouseOver, setMouseOver] = useState<string | null>(null);

  const { mygraph, username, setStoreGraph, removeTrack, track, removeVisits, visits} = useGraphStore();
  
  const handleSubmitTEXT = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    let myjson;
    if(track.length > 0) myjson = removeTrack();
    else myjson = convertToJsonMygraph(mygraph);
    if (visits.length > 0) removeVisits();

    // Simular un tiempo de espera de 1 segundo (1000 milisegundos)
    await new Promise(resolve => setTimeout(resolve, 1000));

    myjson = convertirJSONATexto(myjson);
    const nombreArchivo = `graph${username ? username : ""}.json`;
    const tipoArchivo = 'application/json'; // Tipo MIME del archivo (en este caso, texto plano)

    // Crear un Blob con el contenido y el tipo especificado
    const blob = new Blob([myjson], { type: tipoArchivo });

    // Crear un enlace para descargar el Blob
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = nombreArchivo;

    // Simular un clic en el enlace para iniciar la descarga
    enlaceDescarga.click();

    // Liberar el objeto URL creado para el Blob
    URL.revokeObjectURL(enlaceDescarga.href);


    // Ejemplo de uso:
    setStoreGraph(false);
}

  const handleSubmitJSON = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    e.preventDefault();
    let myjson;
    if(track.length > 0) myjson = removeTrack();
    else myjson = convertToJsonMygraph(mygraph);
    if (visits.length > 0) removeVisits();


    const contenidoArchivo = JSON.stringify(myjson);
    const nombreArchivo = `graph${username ? username : ""}.json`;
    const tipoArchivo = 'application/json'; // Tipo MIME del archivo (en este caso, texto plano)
    
    
    // Crear un Blob con el contenido y el tipo especificado
    const blob = new Blob([contenidoArchivo], { type: tipoArchivo });
      
    // Crear un enlace para descargar el Blob
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = nombreArchivo;
      
    // Simular un clic en el enlace para iniciar la descarga
    enlaceDescarga.click();
      
    // Liberar el objeto URL creado para el Blob
    URL.revokeObjectURL(enlaceDescarga.href);
      
      // Ejemplo de uso:
    setStoreGraph(false);

  }
  const handleClickSave  = async () =>{
    let myjson;
    if(track.length > 0) myjson = removeTrack();
    else myjson = convertToJsonMygraph(mygraph);
    if (visits.length > 0) removeVisits();

    try{  
      const checksum = calcularChecksum(myjson);
          const formGraph = {
            graphJSON: myjson,
            nodes: myjson.nodes.length,
            edges: myjson.edges.length,
            checksum: checksum,
            username: username,
        }
    
        await axios.post(`${import.meta.env.VITE_API_URL}/graph/generate`, formGraph);    
        setStoreGraph(false);
      

    }catch(err){
        console.error("Error guardando grafo", err);
        setStoreGraph(false);

    }
  }
  return (
    <div className="bg-white p-4 border border-gray-300 rounded-md shadow-md">
    <h2 className="text-xl font-semibold mb-4">Seleccionar formato para el archivo:</h2>
    <ul className="space-y-2">
        <div className="flex justify-center">
            <li
                onClick={handleSubmitJSON}
                onMouseOver={() => setMouseOver('json')}
                className={`cursor-pointer ${(mouseOver === 'json') ? 'font-bold bg-gray-100' : ''} p-2 rounded-md hover:bg-gray-100 transition-colors duration-150`}
            >
                <span className="text-blue-500">JSON</span>
            </li>
            <li
                onClick={handleSubmitTEXT}
                onMouseOver={() => setMouseOver('text')}
                className={`cursor-pointer ${(mouseOver === 'text') ? 'font-bold bg-gray-100' : ''} p-2 rounded-md hover:bg-gray-100 transition-colors duration-150`}
            >
                <span className="text-blue-500 uppercase">Text</span>
            </li>
        </div>
    </ul>
    {/* Botón horizontal */

        username ? 
        <div className="flex justify-center mt-4">
            <button
                onClick={handleClickSave}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300 w-full"
            >
                Guardar en mi cuenta
            </button>
        </div>
        : <></>
    }
</div>

  )
}

export default StoreGraph