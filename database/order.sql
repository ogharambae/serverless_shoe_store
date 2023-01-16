-- Active: 1668804737431@@shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com@3306@shoe
CREATE TABLE IF NOT EXISTS Orders (
  order_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id int NOT NULL,
  amount DOUBLE(10, 2) NOT NULL,
  promocode VARCHAR(128),
  currency VARCHAR(10) NOT NULL,
  create_at DATETIME
);
