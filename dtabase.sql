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


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
    --clerk_user_id VARCHAR(255) NOT NULL UNIQUE
);

-- Add 'status' column with default value 'on sale'
ALTER TABLE listings
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'on sale';

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  routing_number VARCHAR(50) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'booked',
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS test_drive_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  test_drive_date DATE NOT NULL,
  test_drive_time TIME NOT NULL,
  additional_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  UNIQUE KEY unique_listing_date (listing_id, test_drive_date)
);


DELIMITER //

CREATE PROCEDURE book_test_drive (
  IN p_listing_id INT,
  IN p_user_email VARCHAR(255),
  IN p_phone_number VARCHAR(20),
  IN p_test_drive_date DATE,
  IN p_test_drive_time TIME,
  IN p_additional_info TEXT
)
BEGIN
  DECLARE existing_booking INT;

  -- Check for existing booking
  SELECT COUNT(*) INTO existing_booking
  FROM test_drive_bookings
  WHERE listing_id = p_listing_id AND test_drive_date = p_test_drive_date;

  IF existing_booking > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A test drive for this listing is already booked on the selected date.';
  ELSE
    -- Insert the new booking
    INSERT INTO test_drive_bookings (
      listing_id, user_email, phone_number, test_drive_date, test_drive_time, additional_info
    ) VALUES (
      p_listing_id, p_user_email, p_phone_number, p_test_drive_date, p_test_drive_time, p_additional_info
    );
  END IF;
END //

DELIMITER ;


-- Create a table for logging cancellations
CREATE TABLE IF NOT EXISTS cancellation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    item_type ENUM('order', 'test_drive_booking') NOT NULL,
    item_id INT NOT NULL,
    cancellation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255) DEFAULT 'Cancelled by user'
);
-- Trigger for logging order cancellations
DELIMITER $$

CREATE TRIGGER after_order_delete
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    INSERT INTO cancellation_logs (user_id, item_type, item_id, reason)
    VALUES (OLD.user_id, 'order', OLD.id, 'Cancelled by user');
END$$

DELIMITER ;

-- Trigger for logging test drive booking cancellations
DELIMITER $$

CREATE TRIGGER after_test_drive_booking_delete
AFTER DELETE ON test_drive_bookings
FOR EACH ROW
BEGIN
    INSERT INTO cancellation_logs (user_id, item_type, item_id, reason)
    VALUES (OLD.user_id, 'test_drive_booking', OLD.id, 'Cancelled by user');
END$$

DELIMITER ;


DELIMITER $$

-- Trigger to update listing status when an order is deleted
CREATE TRIGGER after_order_delete_update_listing_status
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    UPDATE listings
    SET status = 'on sale'
    WHERE id = OLD.listing_id;
END$$

DELIMITER ;

 ALTER TABLE test_drive_bookings ADD COLUMN status VARCHAR(20) DEFAULT 'ON HOLD';
--performed lot of testing for the database and deleted the recodrs for final but the auto increment is still working 
--and the id's startig from when the last record were delted handle this