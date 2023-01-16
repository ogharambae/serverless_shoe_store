-- Active: 1668800888660@@shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com@3306@shoe

CREATE TABLE
    IF NOT EXISTS ShoeOrder (
        shoe_order_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        shoe_id INT NOT NULL,
        quantity INT NOT NULL,
        CONSTRAINT FOREIGN KEY (shoe_id) REFERENCES Shoes(shoe_id),
        CONSTRAINT FOREIGN KEY (order_id) REFERENCES Orders(order_id),
        amount DOUBLE(10, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        create_at DATETIME
    );