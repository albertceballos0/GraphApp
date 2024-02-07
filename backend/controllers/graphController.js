const Graph = require('../models/graphModel');
const fs = require('fs')

exports.getAllGraphs = async (req, res) => {
  try {
    const files = await Graph.getGraphs();
    console.log(files);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFileGraph = async (req, res) => {
  try {
    const id = req.params.id;
    const filePath = await Graph.getFilePathById(id);
    console.log(filePath.archivo);
    const path = `/Users/albertceballos/project/myapp/TestSalesMan/${filePath.archivo}.GR`;
    console.log(path);
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
