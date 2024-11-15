// backend/src/routes/profile.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats/:email', async (req, res) => {
  const userEmail = req.params.email;

  const listingsSql = 'SELECT COUNT(*) AS listingCount FROM listings WHERE email = ?';
  const ordersSql = 'SELECT COUNT(*) AS orderCount FROM orders WHERE buyer_email = ?';
  const bookingsSql = 'SELECT COUNT(*) AS bookingCount FROM test_drive_bookings WHERE user_email = ?';
  const earningsSql = 'SELECT SUM(sellingPrice) AS totalEarnings FROM listings WHERE email = ?';

  try {
    const [listings] = await db.promise().query(listingsSql, [userEmail]);
    const [orders] = await db.promise().query(ordersSql, [userEmail]);
    const [bookings] = await db.promise().query(bookingsSql, [userEmail]);
    const [earningsResult] = await db.promise().query(earningsSql, [userEmail]);

    // Parse totalEarnings to a float. If null (no earnings), default to 0.
    const totalEarnings = parseFloat(earningsResult[0].totalEarnings) || 0;

    res.json({
      listingCount: parseInt(listings[0].listingCount, 10),
      orderCount: parseInt(orders[0].orderCount, 10),
      bookingCount: parseInt(bookings[0].bookingCount, 10),
      totalEarnings: totalEarnings,
    });
  } catch (err) {
    console.error('Error fetching profile stats:', err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

module.exports = router;