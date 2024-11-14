const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure correct path to db.js

/**
 * POST /api/users
 * Body Parameters:
 * - username: String
 * - email: String
 */
router.post('/', async (req, res) => {
  const { username, email } = req.body;

  console.log('Request Body:', req.body);

  // Basic validation
  if (!username || !email) {
    console.error('Missing required fields:', { username, email });
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const insertSql = `
      INSERT INTO users (username, email)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE email = VALUES(email)
    `;

    // Execute the query with mysql2/promise
    const [result] = await db.promise().execute(insertSql, [username, email]); // Ensure db.promise() if using mysql2 with promises

    console.log('User inserted successfully:', result);
    res.status(201).json({ message: 'User inserted successfully.', userId: result.insertId });
  } catch (error) {
    console.error('Error inserting user into database:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

module.exports = router;
