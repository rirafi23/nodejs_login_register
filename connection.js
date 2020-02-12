const mysql = require('mysql')

const config = mysql.createPool({
  connectionLimit:5,
  host: 'localhost',
  user: 'root',
  password: 'qwerty',
  database: 'Penjualan'
})

module.exports = config
