// dbConn.js

const mysql = require('mysql2');

const config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'Railkuni12345',
    database: 'backoffice'
};

// Create a connection pool
const pool = mysql.createConnection(config);

// Export the pool
module.exports = {pool,config}; // Using promise-based API for better async handling
