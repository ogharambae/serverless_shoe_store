-- Active: 1668727972144@@shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com@3306@shoe

CREATE TABLE IF NOT EXISTS Users (
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(20) NOT NULL,
  email VARCHAR(35) NOT NULL,
  isAdmin BOOLEAN NOT NULL,
  create_at DATETIME
);

User Id
Username
Fullname
Password
Email