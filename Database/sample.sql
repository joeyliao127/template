DROP DATABASE IF EXISTS Sample;
CREATE DATABASE Sample;

-- 請確保你是在 Sample 資料庫下執行以下語法

DROP SCHEMA IF EXISTS EC CASCADE;
CREATE SCHEMA EC;

CREATE TABLE EC.Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EC.Items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EC.Orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES EC.Users(id) ON DELETE CASCADE,
    total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EC.OrderItems (
    order_id INT REFERENCES EC.Orders(id) ON DELETE CASCADE,
    item_id INT REFERENCES EC.Items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (order_id, item_id)
);

-- 先插入 user
INSERT INTO EC.Users (username, email) VALUES
('alice', 'alice@example.com'),
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');

-- 插入 item
INSERT INTO EC.Items (name, price, stock) VALUES
('Apple', 10.00, 100),
('Banana', 5.50, 150),
('Carrot', 3.20, 200),
('Donut', 25.00, 50),
('Eggplant', 7.80, 80);

-- 插入 order
INSERT INTO EC.Orders (user_id, total) VALUES
(1, 30.00), -- order id 1
(1, 55.90), -- order id 2
(2, 13.50), -- order id 3
(3, 75.00), -- order id 4
(2, 9.70);  -- order id 5

-- 插入 OrderItems
INSERT INTO EC.OrderItems (order_id, item_id, quantity) VALUES
(1, 1, 2), -- 2 Apple
(1, 2, 2), -- 2 Banana
(2, 4, 2), -- 2 Donut
(2, 5, 1), -- 1 Eggplant
(3, 3, 3), -- 3 Carrot
(4, 2, 5), -- 5 Banana
(4, 4, 1), -- 1 Donut
(5, 5, 1), -- 1 Eggplant
(5, 1, 1); -- 1 Apple

