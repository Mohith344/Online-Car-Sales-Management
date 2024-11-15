// backend/src/routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure correct path to db.js

/**
 * POST /api/orders
 * Body Parameters:
 * - listing_id: Number
 * - buyer_email: String
 * - phone_number: String
 * - bank_name: String
 * - account_number: String
 * - routing_number: String
 */
router.post('/', async (req, res) => {
  const { listing_id, buyer_email, phone_number, bank_name, account_number, routing_number } = req.body;

  console.log('Order Request Body:', req.body);

  // Basic validation
  if (!listing_id || !buyer_email || !phone_number || !bank_name || !account_number || !routing_number) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Check if the listing exists and is on sale
    const [listingRows] = await db.promise().execute(
      'SELECT * FROM listings WHERE id = ? AND status = "on sale"',
      [listing_id]
    );

    if (listingRows.length === 0) {
      return res.status(400).json({ message: 'Listing not available for booking.' });
    }

    // **Duplicate Booking Check**
    const [existingOrders] = await db.promise().execute(
      'SELECT * FROM orders WHERE buyer_email = ? AND listing_id = ?',
      [buyer_email, listing_id]
    );

    if (existingOrders.length > 0) {
      return res.status(400).json({ message: 'You have already booked this listing.' });
    }

    // Insert the order
    const insertOrderSql = `
      INSERT INTO orders (listing_id, buyer_email, phone_number, bank_name, account_number, routing_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [orderResult] = await db.promise().execute(insertOrderSql, [
      listing_id,
      buyer_email,
      phone_number,
      bank_name,
      account_number,
      routing_number,
    ]);

    // Update the listing status to 'booked'
    const updateListingSql = `
      UPDATE listings
      SET status = "booked"
      WHERE id = ?
    `;
    await db.promise().execute(updateListingSql, [listing_id]);

    // Retrieve owner's email from the listing
    const [ownerRows] = await db.promise().execute(
      'SELECT email FROM listings WHERE id = ?',
      [listing_id]
    );
    const ownerEmail = ownerRows[0]?.email || 'seller@example.com'; // Fallback email

    console.log('Order inserted successfully:', orderResult);
    res.status(201).json({
      message: 'Booking successful. Please contact the seller.',
      owner_email: ownerEmail,
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

/**
 * GET /api/orders
 * Query Parameters:
 * - buyer_email: String
 */
router.get('/', async (req, res) => {
  const { buyer_email } = req.query;

  if (!buyer_email) {
    return res.status(400).json({ message: 'Missing buyer_email parameter.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT orders.id, listings.listingTitle, orders.booking_date, orders.status
       FROM orders
       JOIN listings ON orders.listing_id = listings.id
       WHERE orders.buyer_email = ?`,
      [buyer_email]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

/**
 * GET /api/orders/incoming
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
      `SELECT orders.id, orders.buyer_email, listings.listingTitle, orders.booking_date, orders.status
       FROM orders
       JOIN listings ON orders.listing_id = listings.id
       WHERE listings.email = ?`,
      [owner_email]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching incoming orders:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

/**
 * POST /api/orders/:id/accept
 * Path Parameters:
 * - id: Number (Order ID)
 */
router.post('/:id/accept', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the order exists
    const [orderRows] = await db.promise().execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Update the order status to 'accepted'
    await db.promise().execute(
      'UPDATE orders SET status = "accepted" WHERE id = ?',
      [id]
    );

    res.json({ message: 'Order accepted successfully.' });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
})


/**
 * DELETE /api/orders/:id
 * Path Parameters:
 * - id: Number (Order ID)
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().execute('DELETE FROM orders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});


module.exports = router;