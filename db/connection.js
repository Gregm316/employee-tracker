// Require module
const mysql = require('mysql2');

// Connect to db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
});

// Export connection
module.exports = connection;
