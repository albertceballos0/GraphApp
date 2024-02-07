const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'myapp',
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  async getAllUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  },

  async createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // Genera un hash de la contraseña
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return result.insertId;
  },
  async getUserByUsername(username) {
    const [result] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return result[0];
  },
  
  async getGraphs() {
    const [rows] = await pool.query('SELECT * FROM files');
    return rows;
  },


}