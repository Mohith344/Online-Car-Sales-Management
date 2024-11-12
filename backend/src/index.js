const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = require('./db');

// Routes
// eslint-disable-next-line no-undef
const listingsRouter = require('./routes/listings');
app.use('/api/listings', listingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});