const User = require('../models/userModel');
const bcrypt = require('bcrypt');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user= await User.getUserByUsername(username);
    if(!user){
      const userId = await User.createUser(username, password);
      return res.status(200).json({ id: userId , message: 'Registro correcto', register: true});
    }
    else{
      return res.status(200).json({ message: 'Registro fallido, ya existe ese usuario', register: false});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.authenticateUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Busca al usuario por su nombre de usuario
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(200).json({ message: 'Nombre de usuario o contraseña incorrectos', acces: false });
    }
    // Compara la contraseña ingresada con la contraseña almacenada en la base de datos

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(200).json({ message: 'Nombre de usuario o contraseña incorrectos', acces:false });
    }
    // Si las credenciales son válidas, puedes generar un token de autenticación y enviarlo como respuesta
    // Aquí puedes utilizar una librería como jsonwebtoken para generar tokens JWT
    // Por ejemplo:
    // const token = generateAuthToken(user);
    return res.status(200).json({ message: 'Autenticación exitosa', acces: true});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
