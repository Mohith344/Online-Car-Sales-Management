CREATE DATABASE carlistings;
USE carlistings;

CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listingTitle VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  originalPrice DECIMAL(10, 2),
  sellingPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category VARCHAR(255),
  `condition` VARCHAR(255), -- Escaped to avoid conflict with reserved keyword
  make VARCHAR(255),
  model VARCHAR(255),
  Year YEAR, -- Changed to YEAR datatype
  driveType VARCHAR(255),
  transmission VARCHAR(255),
  fuelType VARCHAR(255),
  mileage INT,
  engineSize DECIMAL(10, 2),
  cylinder INT,
  color VARCHAR(255),
  door INT,
  vin VARCHAR(255),
  listingDescription TEXT,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE listing_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT,
  imagePath VARCHAR(255),
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

ALTER TABLE listings ADD COLUMN email VARCHAR(255);

--performed lot of testing for the database and deleted the recodrs for final but the auto increment is still working 
--and the id's startig from when the last record were delted handle this