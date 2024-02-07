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
  
  async getGraphs() {
    const [rows] = await pool.query('SELECT * FROM files');
    return rows;
  },
  async getFilePathById(id) {
    const [rows] = await pool.query('SELECT archivo FROM files WHERE id = ?', [id]);
    return rows[0];
  },

}