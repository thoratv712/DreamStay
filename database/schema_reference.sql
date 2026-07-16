-- =====================================================================
-- DreamStay Database Schema (Reference)
-- NOTE: The Spring Boot backend auto-creates/updates these tables on
-- startup via Hibernate (spring.jpa.hibernate.ddl-auto=update), and
-- src/main/resources/data.sql seeds sample rooms + an admin user.
-- This file is provided for reference or manual setup if you prefer
-- to create the schema yourself.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS dreamstay_db;
USE dreamstay_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    description VARCHAR(2000),
    image_url VARCHAR(500),
    available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS room_amenities (
    room_id BIGINT NOT NULL,
    amenity VARCHAR(255),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
