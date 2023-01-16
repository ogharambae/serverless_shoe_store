-- Active: 1668800888660@@shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com@3306@shoe

CREATE TABLE
    IF NOT EXISTS Shoes (
        shoe_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        shoe_name VARCHAR(255) NOT NULL,
        shoe_size FLOAT NOT NULL,
        image_url mediumtext NOT NULL,
        price DOUBLE(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT (1),
        currency VARCHAR(10) NOT NULL,
        category VARCHAR(20) NOT NULL,
        description VARCHAR(255) NOT NULL,
        create_at DATETIME
    );