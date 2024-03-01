const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'myapp',

});

module.exports = {
  
async createToken(token) {
        // Obtener la fecha y hora actual
        const currentDate = new Date();
      
        // Agregar un período de 24 horas para la validez del token
        const expirationDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000)); // 24 horas en milisegundos
      
        // Formatear la fecha de expiración en una cadena legible
        const formattedExpirationDate = expirationDate.toISOString();
      
        // Insertar el token y la fecha de expiración en la base de datos
        const [rows] = await pool.query('INSERT INTO tokens (token, expiration_date, users) VALUES (?, ?, ?)', [token, formattedExpirationDate, 0]);
        return rows;
},
async validateToken(token) {

        const [rows] = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
        return rows[0];
        

},  
async getUserToken(token) {

        const [rows] = await pool.query('SELECT users FROM tokens WHERE token = ?', [token]);
        return rows[0];
        
},
async setUserToken(token, userId) {
        const [rows] = await pool.query('UPDATE tokens SET users = ? WHERE token = ?', [ userId, token]);        
},
     
     

}