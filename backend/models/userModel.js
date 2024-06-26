const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
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