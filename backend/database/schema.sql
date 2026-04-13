CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','receptionist','customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10) UNIQUE NOT NULL,
  type ENUM('single','double','suite') NOT NULL,
  image_url VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  status ENUM('available','booked','maintenance') DEFAULT 'available'
);

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('cash','stripe','chapa') NOT NULL,
  status ENUM('pending','completed','failed') NOT NULL,
  transaction_id VARCHAR(255),
  FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);
