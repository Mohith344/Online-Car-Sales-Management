// backend/src/routes/test_drive_bookings.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure correct path to db.js

/**
 * POST /api/test_drive_bookings
 * Body Parameters:
 * - listing_id: Number
 * - user_email: String
 * - phone_number: String
 * - test_drive_date: String (YYYY-MM-DD)
 * - test_drive_time: String (HH:MM:SS)
 * - additional_info: String (Optional)
 */
router.post('/', async (req, res) => {
  const { listing_id, user_email, phone_number, test_drive_date, test_drive_time, additional_info } = req.body;

  console.log('Test Drive Booking Request Body:', req.body);

  // Basic validation
  if (!listing_id || !user_email || !phone_number || !test_drive_date || !test_drive_time) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // **1. Check if the user has already booked this listing**
    const [existingBookings] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM test_drive_bookings WHERE listing_id = ? AND user_email = ?',
      [listing_id, user_email]
    );

    const bookingCount = existingBookings[0].count;

    if (bookingCount > 0) {
      console.error('Duplicate booking attempt by user:', user_email, 'for listing:', listing_id);
      return res.status(400).json({ message: 'You have already booked a test drive for this listing.' });
    }

    // **2. Call the stored procedure to insert the new booking**
    await db.promise().query(
      'CALL book_test_drive(?, ?, ?, ?, ?, ?)',
      [listing_id, user_email, phone_number, test_drive_date, test_drive_time, additional_info || null]
    );

    console.log('Test Drive Booking inserted successfully');
    res.status(201).json({
      message: 'Test drive booking successful. We will contact you shortly.',
    });
  } catch (error) {
    console.error('Error processing test drive booking:', error);

    // Handle specific error from stored procedure
    if (error.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(400).json({ message: error.sqlMessage });
    }

    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

/**
 * GET /api/test_drive_bookings
 * Query Parameters:
 * - user_email: String
 */
router.get('/', async (req, res) => {
  const { user_email } = req.query;

  if (!user_email) {
    return res.status(400).json({ message: 'Missing user_email parameter.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT test_drive_bookings.id, listings.listingTitle, test_drive_bookings.test_drive_date, test_drive_bookings.test_drive_time, test_drive_bookings.status
       FROM test_drive_bookings
       JOIN listings ON test_drive_bookings.listing_id = listings.id
       WHERE test_drive_bookings.user_email = ?`,
      [user_email]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching test drive bookings:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

/**
 * GET /api/test_drive_bookings/incoming
 * Query Parameters:
 * - owner_email: String
 */
router.get('/incoming', async (req, res) => {
  const { owner_email } = req.query;

  if (!owner_email) {
    return res.status(400).json({ message: 'Missing owner_email parameter.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT test_drive_bookings.id, test_drive_bookings.user_email, listings.listingTitle, test_drive_bookings.test_drive_date, test_drive_bookings.test_drive_time, test_drive_bookings.status
       FROM test_drive_bookings
       JOIN listings ON test_drive_bookings.listing_id = listings.id
       WHERE listings.email = ?`,
      [owner_email]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching incoming test drive bookings:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

/**
 * POST /api/test_drive_bookings/:id/accept
 * Path Parameters:
 * - id: Number (Booking ID)
 */
router.post('/:id/accept', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the booking exists
    const [bookingRows] = await db.promise().execute(
      'SELECT * FROM test_drive_bookings WHERE id = ?',
      [id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Test drive booking not found.' });
    }

    // Update the booking status to 'accepted'
    await db.promise().execute(
      'UPDATE test_drive_bookings SET status = "accepted" WHERE id = ?',
      [id]
    );

    res.json({ message: 'Test drive booking accepted successfully.' });
  } catch (error) {
    console.error('Error accepting test drive booking:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});




/**
 * DELETE /api/test_drive_bookings/:id
 * Path Parameters:
 * - id: Number (Booking ID)
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().execute('DELETE FROM test_drive_bookings WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Test drive booking not found.' });
    }

    res.json({ message: 'Test drive booking cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling test drive booking:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});


module.exports = router;