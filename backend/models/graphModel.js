const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'myapp',

});

module.exports = {
  
  async getGraphs(id) {
    const [rows] = await pool.query('SELECT * FROM grafos WHERE users = ?', [id]);
    return rows;
  },
  async getFilePathById(id) {
    const [rows] = await pool.query('SELECT archivo FROM grafos WHERE id = ?', [id]);
    return rows[0];
  },
  async setCheckSum (checksum, id){
      const [result] = await pool.query('UPDATE grafos SET checksum = ? WHERE id = ?;', [checksum, id]);
      return 0;
  },
  async getGraphByUser(checksum, id) {
      const [rows] = await pool.query('SELECT archivo FROM grafos WHERE checksum = ? AND (users = ? OR users = ?)', [checksum, id, 0]);
      return rows[0];

  },  
  async getGraph(checksum) {

      const [rows] = await pool.query('SELECT archivo FROM grafos WHERE checksum = ?', [checksum]);
      return rows[0];
    
  },
  async getCountGraph() {
    const [rows] = await pool.query('SELECT count(*) FROM grafos');
    return rows[0];
  },

  async setGraph(archivo, nodes, edges, checksum, id) {

    return await pool.query('INSERT INTO grafos (archivo, nodos, aristas, checksum, users) VALUES (?, ?, ?, ?, ?)', [archivo, nodes,edges, checksum, id]);

  },
  async deleteGraph(archivo) {

    return await pool.query('DELETE FROM grafos WHERE archivo = ?', [archivo]);

  },

}