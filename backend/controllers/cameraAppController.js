const Tokens = require('../models/cameraAppModel');
const Users = require('../models/userModel');

const qr = require('qrcode');
const { v4: uuidv4 } = require('uuid');

exports.generateQR = async (req, res) => {

    try {
        const uniqueToken = uuidv4();
        const response = await Tokens.createToken(uniqueToken);
        const url = `http://192.168.0.2:5173/camera/mobileApp/${uniqueToken}`; // URL para el QR
        const imageQr = await qr.toDataURL(url); // Genera el QR como una URL de imagen
    
        // Envía la URL del QR al cliente
        res.json({ 'imageQr': imageQr , 'token': uniqueToken });
      } catch (error) {
        console.error('Error al generar el QR:', error);
        res.status(500).json({ error: 'Error al generar el QR' });
      }
};

exports.validateQR = async (req, res) => {

    try {
      const token   = req.params.token;
      const t = await Tokens.validateToken(token);

      if(!t ) return res.json({ 'validate': false });
 
      let currentDate = new Date();
      currentDate = currentDate.toISOString();

      if(currentDate < t.expiration_date){

            const url = `http://192.168.0.2:5173/camera/mobileApp/${t.token}`; // URL para el QR
            const imageQr = await qr.toDataURL(url); // Genera el QR como una URL de imagen
            
            // Envía la URL del QR al cliente
            return res.json({ 'imageQr': imageQr , 'validate': true, 'users': t.users });
      }
      return res.json({ 'validate': false });

    } catch (error) {
            console.error('Error al validar el token:', error);
            res.status(500).json({ error: 'Error al validar el token' });
    }
};

exports.tokenFree = async (req,res) => {
  try {
    const token   = req.params.token;
    const username  = req.params.username;
    const user = await Tokens.getUserToken(token);
    const userId = await Users.getUserByUsername(username);

    if(user.users !== 0) return res.json({ 'validate': false });
    if(!userId.id) return res.json({ 'validate': false });

    try{

        await Tokens.setUserToken(token, userId.id);
        return res.json({ 'validate': true });

    }catch(err){
          console.error('Error al asignar el token:', error);
          res.status(500).json({ error: 'Error al asignar el token' });
    }
  
  } catch (error) {
          console.error('Error al asignar el token:', error);
          res.status(500).json({ error: 'Error al asignar el token' });
  }
};

exports.liberarToken = async (req,res) => {
  try{
    const token = req.params.token;
    const response = await Tokens.setUserToken(token, 0);
    res.json({'message': "Liberado correctamente"});
  }catch(err){
    console.error('Error al liberar el token:', error);
    res.status(500).json({ error: 'Error al liberar el token' });
  }
};



