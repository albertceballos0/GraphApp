const Graph = require('../models/graphModel.js');
const Users = require('../models/userModel.js');

const fs = require('fs');
const utils  = require('../utils.js');
const { exec } = require('child_process');
const { stdout, stderr } = require('process');

exports.getAllGraphs = async (req, res) => {
  try {
    const files = await Graph.getGraphs(0);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPersonalGraphs = async (req, res) => {
  try{
    const id = await Users.getUserByUsername(req.params.username)
    try {
      const files = await Graph.getGraphs(id.id);
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }catch(err){
    res.status(500).json({ message: error.message });

  }
};

exports.getFileGraph = async (req, res) => {
  try {
    const id = req.params.id;
    const filePath = await Graph.getFilePathById(id);
    const path = `/Users/albertceballos/project/GraphApp/TestSalesMan/${filePath.archivo}`;
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
      // Enviar el contenido del archivo como respuesta
      res.send(data);
    });  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setCheckSum = async (req, res) => {
    const id = req.params.id;
    const { checksum } = req.body;
    try {
      const files = await Graph.setCheckSum(checksum, id);
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({ message: `Error mal ${error.message}` });
    }
};

exports.getGraph = async (req, res) => {
  const checksum = req.params.checksum;
  try {
    const files = await Graph.getGraph(checksum);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: `Error mal ${error.message}` });
  }
};
exports.setGraph = async (req,res) => {
  
  const { graphJSON , nodes, edges, checksum, username} = req.body;
  try {

   let response;
   let id;
   if(username){
      id = await Users.getUserByUsername(username);
      if(id){
        response = await Graph.getGraphByUser(checksum, id.id);
        console.log(id.id);

      }else{
        response = await Graph.getGraph(checksum);
    } 
   }else{
    response = await Graph.getGraph(checksum);
   }
    let archivo;
    if(response){
      archivo = response.archivo;
    }else{
      try{
        const idFile = await Graph.getCountGraph();
        archivo = `Graf${idFile['count(*)'] + 2}.GR`;
        try{
          if(username){
              await Graph.setGraph(archivo, nodes, edges, checksum, id.id);
          }
          else{
            await Graph.setGraph(archivo, nodes, edges, checksum, -1);
          }
        } catch(err){
          res.status(500).json({ message: `Error creando entrada en la base de datos sobre el grafo ${error.message}` });
        }

      }
      catch(err){
        res.status(500).json({ message: `Error contando numero de grafos ${error.message}` });
      }

    }
    console.log(archivo);
      try{
        const data = utils.convertirJSONATexto(graphJSON);


        const directorio = '/Users/albertceballos/project/GraphApp/TestSalesMan';
        const path = `${directorio}/${archivo}`;
        
        // Verificar si el directorio existe, si no, crearlo
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio);
        }
    
        // Escribir el contenido del archivo en un archivo local en el servidor
        fs.writeFileSync(path, data);
        res.json({message : "grafo creado en el servidor correctamente", archivo: archivo});
      }catch(err){
        console.log(err);
        res.status(500).json({ message: `Error generando archivo en el servidor ${error.message}` });
      }


  } catch (error) {
    res.status(500).json({ message: `Error comprobando checksum ${error.message}` });
  }

};


exports.setVisits = async (req,res) => {
    const {visits} = req.body;

    try{
      const directorio = '/Users/albertceballos/project/GraphApp/TestSalesMan';
      const rutaCompleta = `${directorio}/visites.VIS`;
      
      // Verificar si el directorio existe, si no, crearlo
      if (!fs.existsSync(directorio)) {
          fs.mkdirSync(directorio);
      }
  
      // Escribir el contenido del archivo en un archivo local en el servidor
      fs.writeFileSync(rutaCompleta, visits);
      res.send("archivo visitas creado en el servidor correctamente");
    }catch(err){
      console.log(err);
      res.status(500).json({ message: `Error generando archivo visitas en el servidor ${error.message}` });
    }

};

exports.execTrack = (req,res) =>{
  const {archivo } = req.body;
  const comando = `./GraphApplication ../TestSalesMan/${archivo} ../TestSalesMan/visites.VIS`;

  const tiempoMaximoEspera = 5000; // Tiempo máximo de espera en milisegundos (por ejemplo, 5000ms = 5 segundos)

  exec(comando, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error al ejecutar el archivo ejecutable: ${error.message}`);
          res.json({message: 'han habido problemas calciulando track' });
          return;
      }
      if (stderr) {
          console.error(`Error de salida estándar: ${stderr}`);
          return;
      }
      console.log({ message: 'Archivo ejecutable ejecutado correctamente', output: stdout });
      res.json({message: 'Archivo ejecutable ejecutado correctamente', output: stdout });
      return;
  });
};
  exports.deleteGraph = (req,res) =>{
    const archivo  = req.params.archivo;

    console.log(archivo, "HOLAAAAAA");
    res.json({message: 'Archivo ejecutable ejecutado correctamente' });

};
    
