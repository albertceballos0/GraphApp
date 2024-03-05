const Files = require('../models/fileRecognitionModel');
const Users = require('../models/userModel');


exports.addFileController = async (req, res) => {
    console.log(req.body);
    try {
        const userId = req.body.userId;
        const name = req.body.name;
        if (!userId) return res.status(400).json({ error: 'El id del usuario es requerido' });
        const users = await Users.getAllUsers();
        const foundUser = users.some(user => user.id === userId);
        if(!foundUser ) return res.json({ 'added': false, 'message': "No existe ese userId" });

        const files = await Files.getFiles(userId);
        const found = files.some(file => file.name === name);
        if(found ) return res.json({ 'added': false, 'message': "Ya existe esta esa cara registrada" });
        try{
            await Files.addFile(userId, name);
            res.json({ 'added': true, 'message': "Cara añadida correctamente"});
        }
        catch (error) {
            console.error('Error al buscar archivos', error);
            res.status(500).json({ error: 'Error al añadir userFace' });
        }
    } catch (error) {
        console.error('Error al buscar archivos', error);
        res.status(500).json({ error: 'Error al buscar userFace' });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const userId = req.params.userId;
        if(!userId) return res.status(400).json({ error: 'El id del usuario es requerido' });
        const response = await Files.getFiles(userId);
        res.json({ 'faces': response });
      } catch (error) {
        console.error('Error al buscar archivos', error);
        res.status(500).json({ error: 'Error al buscar userFace' });
      }

};

exports.deleteFile = async (req, res) => {
    const filename = req.params.filename;

    try{
        const response = await Files.getFile(filename);
        if(response.length === 0) return res.json({ 'deleted': false, 'message': "No existe ese archivo" });
        console.log(response[0].id);
        const deleted = await Files.deleteFile(response[0].id);
        if(deleted.affectedRows !== 1) return res.json({ 'deleted': false, 'message': "Error al eliminar el archivo" });
        return res.json({ 'deleted': true, 'message': "Cara eliminada correctamente"});
    }catch (error) {
        console.error('Error al elliminar archivos', error);
        res.status(500).json({ error: 'Error al eliminar userFace' });
    }   

}