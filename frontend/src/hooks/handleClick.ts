import axios from "axios";

import Graph from "graphology";
import { GraphData, calcularChecksum, convertToJsonMygraph, convertirVisitsATexto } from "./utilities";

export async function initialize(mygraph: Graph , num : number) {
    const graphJSON = convertToJsonMygraph(mygraph);
    const checksum = calcularChecksum(graphJSON)

    try{
        const formVisits = {
            checksum: checksum,
        };
        await axios.post(`http://localhost:3000/graph/initialize/${num}`, formVisits);
    }catch(err){
        console.error("error generando archivo visitas", err);

    }

}


export async function handleClickGenerateTrack(graphJSON: GraphData , visits: string[], username: string | null){

        const checksum = calcularChecksum(graphJSON);
        
        try{
            const visitsText = convertirVisitsATexto(visits);
            const formVisits = {
                visits: visitsText,
            };
            await axios.post(`http://localhost:3000/graph/visits`, formVisits);
        }catch(err){
            console.error("error generando archivo visitas", err);

        }
        try {
            const formGraph = {
                graphJSON: graphJSON,
                nodes: graphJSON.nodes.length,
                edges: graphJSON.edges.length,
                checksum: checksum,
                username: username,
            }
            
            let response = await axios.post(`http://localhost:3000/graph/generate`, formGraph);    
            try{

                const formExec = {
                    archivo: response.data.archivo,
                }
                
                response = await axios.post(`http://localhost:3000/graph/track`, formExec);
                
                if(response){
                    if(response.data.output){
                        const cadena = response.data.output
                        // Expresión regular para extraer el string [V0001 -> ...
                        const regex = /\[(.*?)\]/;
                        const match = cadena.match(regex);

                        if (match) {
                            // Extraer la cadena entre [ y ]
                            const cadenaNodos = match[1];

                            // Dividir la cadena por ->
                            const nodos = cadenaNodos.split(' -> ');

                            
                            
                            //Antes de devolver el track vamos a borrar el archivo creado si no tenemos usuario logueado
                            if(!username){   
                                try{

                                    console.log(formExec.archivo, "HOLA");
                                    await axios.get(`http://localhost:3000/graph/borrar/${formExec.archivo}`);
                                }
                                catch(err){
                                    console.log("Error borrando archivo");

                                 }
                            }
                            
                            return {nodos : nodos, message: response.data.message};
                        } else {
                            
                            console.log("No se encontró ningún string que coincida con el patrón.");
                        }
                    }
                    else{
                        return {message: response.data.message};
                    }
                }
            }catch(err){
                console.error("error ejecutando programa en el backend", err);
            }

        }catch(err){
            console.error("error creando nuevo fichero grafo", err);
        }
        return null;
}