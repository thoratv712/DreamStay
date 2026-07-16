-- ================================================
-- DreamStay Sample Data
-- Default admin login: admin@dreamstay.com / admin123
-- (password is BCrypt-encoded below)
-- ================================================

INSERT INTO users (full_name, email, password, phone, role, created_at)
SELECT 'DreamStay Admin', 'admin@dreamstay.com',
       '$2b$10$b6e8bHR1Cfw4nDbVD8RFH.hWLOLmUezV9bGpRS55D9aeMJshD1TyG',
       '9999999999', 'ROLE_ADMIN', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@dreamstay.com');

INSERT INTO rooms (room_number, type, price_per_night, capacity, description, image_url, available)
SELECT '101', 'SINGLE', 59.00, 1,
       'A cozy single room perfect for solo travelers, featuring a comfortable bed and workspace.',
       'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800', true
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number = '101');

INSERT INTO rooms (room_number, type, price_per_night, capacity, description, image_url, available)
SELECT '102', 'DOUBLE', 89.00, 2,
       'Spacious double room with a queen-size bed, ideal for couples or business travelers.',
       'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', true
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number = '102');

INSERT INTO rooms (room_number, type, price_per_night, capacity, description, image_url, available)
SELECT '201', 'DELUXE', 149.00, 2,
       'Elegant deluxe room with premium furnishings, city view, and a relaxing lounge area.',
       'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', true
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number = '201');

INSERT INTO rooms (room_number, type, price_per_night, capacity, description, image_url, available)
SELECT '202', 'DELUXE', 159.00, 3,
       'Modern deluxe room with a king-size bed, sofa area, and stunning skyline views.',
       'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', true
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number = '202');

INSERT INTO rooms (room_number, type, price_per_night, capacity, description, image_url, available)
SELECT '301', 'SUITE', 249.00, 4,
       'Luxurious suite featuring a separate living area, premium amenities, and panoramic views.',
       'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800', true
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number = '301');

INSERT INTO rooms (room_number, type, price_per_night, capacity, description, image_url, available)
SELECT '302', 'SUITE', 299.00, 4,
       'Our premium presidential-style suite with a private balcony, jacuzzi, and butler service.',
       'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', true
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number = '302');

INSERT INTO rooms (room_number, type, price_per_night, capacity, description, image_url, available)
SELECT '401', 'FAMILY', 189.00, 5,
       'Generous family room with two queen beds, perfect for families traveling together.',
       'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', true
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number = '401');
