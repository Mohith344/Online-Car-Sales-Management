const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all listings with images
router.get('/user/:email', (req, res) => {
  const userEmail = req.params.email;
  const sql = `
    SELECT l.*, GROUP_CONCAT(li.imagePath) AS images
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    WHERE l.email = ?
    GROUP BY l.id
  `;
  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error('Error retrieving listings:', err);
      return res.status(500).json({ message: 'Error retrieving listings', error: err.message });
    }
    res.json(results);
  });
});

// Create a new listing
router.post('/', upload.array('images', 10), (req, res) => {
  const {
    listingTitle,
    tagline,
    originalPrice,
    sellingPrice,
    category,
    condition,
    make,
    model,
    year,
    driveType,
    transmission,
    fuelType,
    mileage,
    engineSize,
    cylinder,
    color,
    door,
    vin,
    listingDescription,
    features,
    email, // Add email to the request body
  } = req.body;

  const featuresJson = JSON.stringify(features); // Convert features to JSON string

  const sql = `
    INSERT INTO listings (
      listingTitle, tagline, originalPrice, sellingPrice, category, \`condition\`, make, model, year, driveType, transmission, fuelType, mileage, engineSize, cylinder, color, door, vin, listingDescription, features, email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      listingTitle,
      tagline,
      originalPrice,
      sellingPrice || 0, // Default value for sellingPrice
      category,
      condition,
      make,
      model,
      year,
      driveType,
      transmission,
      fuelType,
      mileage,
      engineSize,
      cylinder,
      color,
      door,
      vin,
      listingDescription,
      featuresJson,
      email, // Add email to the query parameters
    ],
    (err, result) => {
      if (err) {
        console.error('Error creating listing:', err);
        return res.status(500).json({ message: "Error creating listing", error: err.message });
      }

      const listingId = result.insertId;

      // Insert image paths into listing_images table
      const imagePaths = req.files.map(file => [listingId, path.relative(uploadDir, file.path)]);
      const imageSql = 'INSERT INTO listing_images (listing_id, imagePath) VALUES ?';
      db.query(imageSql, [imagePaths], (err) => {
        if (err) {
          console.error('Error saving images:', err);
          return res.status(500).json({ message: "Error saving images", error: err.message });
        }
        res.status(201).json({ message: 'Listing created successfully' });
      });
    }
  );
});

module.exports = router;