// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's URL if different
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const listingsRouter = require('./routes/listings');
const usersRouter = require('./routes/user');
const ordersRouter = require('./routes/orders'); // Import Orders route
const testDriveBookingsRouter = require('./routes/test_drive_bookings'); // Import Test Drive Bookings route
const profileRoutes = require('./routes/profile');

app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/test_drive_bookings', testDriveBookingsRouter); // Use Test Drive Bookings route
app.use('/api/profile', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});