const mysql = require('mysql2');
// Create a connection to the MySQL database with specified configuration
const db = mysql.createConnection({
  host: 'localhost',  // The host where the MySQL server is running
  user: 'root', // The username for MySQL authentication
  password: 'madhu05$', // The password for MySQL authentication
  database: 'carlistings',  // The name of the database to connect to

});

// Establish the connection to the database and handle potential errors
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = db;