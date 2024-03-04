const mysql = require('mysql2/promise');
const { addFile } = require('../controllers/fileRecognitionController');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'myapp',
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  async getFiles (userId){
    const [rows] = await pool.query('SELECT * FROM userFaces WHERE userId = ?', [userId]);
    return rows;
  },

  async addFile(userId, name){
    const [result] = await pool.query('INSERT INTO userFaces (name, userId) VALUES (?, ?)', [name, userId]);
    return result.insertId;
  },
  async getFile(filename){
    const [result] = await pool.query('SELECT id FROM userFaces WHERE name = ?', [filename]);
    return result;
  },
  async deleteFile(id){
    const [result] = await pool.query('DELETE FROM userFaces WHERE id = ?', [id]);
    return result;
  },

}