// Import necessary modules and dependencies
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
// Configure Multer for handling file uploads with custom storage options
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

/**
 * GET /api/listings/search
 * Query Parameters:
 * - condition: String (e.g., "New", "Used", "Certified Pre-Owned")
 * - make: String (e.g., "Toyota", "Honda")
 * - price: Number (Max Price)
 */
// Route: Search listings with filters for condition, make, price, and limit
// Constructs and executes a dynamic SQL query based on provided query parameters
// Returns results as JSON, including associated images

router.get('/Search', (req, res) => {
  const { condition, make, price, limit } = req.query;

  let sql = `
    SELECT l.*, GROUP_CONCAT(li.imagePath) AS images
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
  `;

  let conditions = [];
  let values = [];

  if (condition) {
    conditions.push('l.condition = ?');
    values.push(condition);
  }

  if (make) {
    conditions.push('l.make = ?');
    values.push(make);
  }

  if (price) {
    conditions.push('l.sellingPrice <= ?');
    values.push(price);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' GROUP BY l.id';

  // Handle the limit parameter
  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      sql += ' LIMIT ?';
      values.push(parsedLimit);
    }
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Server Error', error: err.message });
    }

    res.json(results);
  });
});



// Get all listings with images for a user
// Route: Retrieve all listings for a specific user by their email
// Groups and includes images for each listing

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

// New Route: GET listings by category
// Route: Retrieve listings by category
// Fetches listings filtered by the specified category and includes images

router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  const sql = `
    SELECT l.*, GROUP_CONCAT(li.imagePath) AS images
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    WHERE l.category = ?
    GROUP BY l.id
  `;
  db.query(sql, [category], (err, results) => {
    if (err) {
      console.error('Error retrieving listings by category:', err);
      return res.status(500).json({ message: 'Error retrieving listings', error: err.message });
    }
    res.json(results);
  });
});

// Get a single listing by ID
// Route: Retrieve a single listing by its ID
// Fetches detailed information about the listing, including images
router.get('/:id', (req, res) => {
  const listingId = req.params.id;
  const sql = `
    SELECT l.*, GROUP_CONCAT(li.imagePath) AS images
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    WHERE l.id = ?
    GROUP BY l.id
  `;
  db.query(sql, [listingId], (err, results) => {
    if (err) {
      console.error('Error retrieving listing:', err);
      return res.status(500).json({ message: 'Error retrieving listing', error: err.message });
    }
    res.json(results[0]);
  });
});

// backend/src/routes/listings.js

// Add this route to calculate total earnings for a user
// Route: Calculate total earnings for a user
// Aggregates the selling prices of all listings for the given user email


router.get('/earnings/:email', async (req, res) => {
  const userEmail = req.params.email;
  const sql = `
    SELECT SUM(sellingPrice) AS totalEarnings
    FROM listings
    WHERE email = ?
  `;
  try {
    const [rows] = await db.promise().query(sql, [userEmail]);
    const totalEarnings = rows[0].totalEarnings || 0;
    res.json({ totalEarnings });
  } catch (err) {
    console.error('Error fetching total earnings:', err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

// Create a new listing

// Route: Create a new listing
// Accepts listing details and image files via a multipart/form-data request
// Saves the listing in the database and stores associated image paths
// Handles both existing and newly uploaded images

router.post('/', upload.array('newImages', 10), (req, res) => {
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
    email,
    existingImages, // Array of existing image filenames
  } = req.body;

  const featuresJson = JSON.stringify(features);

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
      sellingPrice || 0,
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
      email,
    ],
    (err, result) => {
      if (err) {
        console.error('Error creating listing:', err);
        return res.status(500).json({ message: "Error creating listing", error: err.message });
      }

      const listingId = result.insertId;

      // Handle existing images
      // Route: Update an existing listing
      // Updates listing details in the database and replaces old image associations with new ones
      // Deletes existing image entries in the database and inserts updated paths


      let allImages = [];
      if (existingImages) {
        try {
          allImages = JSON.parse(existingImages);
        } catch (parseErr) {
          console.error('Error parsing existingImages:', parseErr);
          return res.status(400).json({ message: "Invalid existingImages format", error: parseErr.message });
        }
      }

      // Handle new images
      // Route: Delete a listing by its ID
      // Deletes the listing from the database, retrieves and deletes associated images from the filesystem
      // Handles image deletion errors gracefully

      const newImagePaths = req.files.map(file => file.filename);
      allImages = [...allImages, ...newImagePaths];

      // Insert image paths into listing_images table
      const imagePaths = allImages.map(image => [listingId, image]);
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








// Update an existing listing
router.put('/:id', upload.array('newImages', 10), (req, res) => {
  const listingId = req.params.id;
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
    email,
    existingImages, // Array of existing image filenames
  } = req.body;

  const featuresJson = JSON.stringify(features);

  const sql = `
    UPDATE listings SET
      listingTitle = ?, tagline = ?, originalPrice = ?, sellingPrice = ?, category = ?, \`condition\` = ?, make = ?, model = ?, year = ?, driveType = ?, transmission = ?, fuelType = ?, mileage = ?, engineSize = ?, cylinder = ?, color = ?, door = ?, vin = ?, listingDescription = ?, features = ?, email = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      listingTitle,
      tagline,
      originalPrice,
      sellingPrice || 0,
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
      email,
      listingId
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating listing:', err);
        return res.status(500).json({ message: "Error updating listing", error: err.message });
      }

      // Handle existing images
      let allImages = [];
      if (existingImages) {
        try {
          allImages = JSON.parse(existingImages);
        } catch (parseErr) {
          console.error('Error parsing existingImages:', parseErr);
          return res.status(400).json({ message: "Invalid existingImages format", error: parseErr.message });
        }
      }

      // Handle new images
      const newImagePaths = req.files.map(file => file.filename);
      allImages = [...allImages, ...newImagePaths];

      // First, delete existing image entries from the DB
      const deleteImageSql = 'DELETE FROM listing_images WHERE listing_id = ?';
      db.query(deleteImageSql, [listingId], (err) => {
        if (err) {
          console.error('Error deleting old images:', err);
          return res.status(500).json({ message: "Error deleting old images", error: err.message });
        }

        // Insert updated image paths
        const imagePaths = allImages.map(image => [listingId, image]);
        const insertImageSql = 'INSERT INTO listing_images (listing_id, imagePath) VALUES ?';

        db.query(insertImageSql, [imagePaths], (err) => {
          if (err) {
            console.error('Error saving updated images:', err);
            return res.status(500).json({ message: "Error saving updated images", error: err.message });
          }
          res.status(200).json({ message: 'Listing updated successfully' });
        });
      });
    }
  );
});





// DELETE a listing by ID
router.delete('/:id', (req, res) => {
  const listingId = req.params.id;

  // First, retrieve all image paths related to this listing
  const getImagesSql = 'SELECT imagePath FROM listing_images WHERE listing_id = ?';
  db.query(getImagesSql, [listingId], (err, results) => {
    if (err) {
      console.error('Error retrieving images for deletion:', err);
      return res.status(500).json({ message: 'Error retrieving images', error: err.message });
    }

    const imagePaths = results.map(row => row.imagePath);

    // Delete the listing (including listing_images due to ON DELETE CASCADE)
    const deleteListingSql = 'DELETE FROM listings WHERE id = ?';
    db.query(deleteListingSql, [listingId], (err, result) => {
      if (err) {
        console.error('Error deleting listing:', err);
        return res.status(500).json({ message: 'Error deleting listing', error: err.message });
      }

      // Now, delete image files from the filesystem
      imagePaths.forEach(image => {
        const filePath = path.join(uploadDir, image);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting image file ${filePath}:`, err);
            // Continue deleting other files even if one fails
          }
        });
      });

      res.status(200).json({ message: 'Listing deleted successfully' });
    });
  });
});


module.exports = router;