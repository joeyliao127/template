DROP DATABASE IF EXISTS sample;
CREATE DATABASE sample;

\c sample;

-- 請確保你是在 Sample 資料庫下執行以下語法

DROP SCHEMA IF EXISTS ec CASCADE;
CREATE SCHEMA ec;

CREATE TABLE ec.Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ec.Items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ec.Orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES ec.Users(id) ON DELETE CASCADE,
    total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ec.OrderItems (
    order_id INT REFERENCES ec.Orders(id) ON DELETE CASCADE,
    item_id INT REFERENCES ec.Items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (order_id, item_id)
);

-- 先插入 user
INSERT INTO ec.Users (username, email) VALUES
('alice', 'alice@example.com'),
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');

-- 插入 item
INSERT INTO ec.Items (name, price, stock) VALUES
('Apple', 10.00, 100),
('Banana', 5.50, 150),
('Carrot', 3.20, 200),
('Donut', 25.00, 50),
('Eggplant', 7.80, 80);

-- 插入 order
INSERT INTO ec.Orders (user_id, total) VALUES
(1, 30.00), -- order id 1
(1, 55.90), -- order id 2
(2, 13.50), -- order id 3
(3, 75.00), -- order id 4
(2, 9.70);  -- order id 5

-- 插入 OrderItems
INSERT INTO ec.OrderItems (order_id, item_id, quantity) VALUES
(1, 1, 2), -- 2 Apple
(1, 2, 2), -- 2 Banana
(2, 4, 2), -- 2 Donut
(2, 5, 1), -- 1 Eggplant
(3, 3, 3), -- 3 Carrot
(4, 2, 5), -- 5 Banana
(4, 4, 1), -- 1 Donut
(5, 5, 1), -- 1 Eggplant
(5, 1, 1); -- 1 Apple

