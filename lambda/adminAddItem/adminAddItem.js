var mysql = require('mysql');

var con = mysql.createConnection({
    host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "admin123",
    database: "shoe"
});

exports.handler = async (event) => {
    return new Promise((resolve, reject) => {
        console.log(event["body-json"])
        con.query(`SELECT isAdmin FROM Users WHERE user_id = ${event["body-json"].userId}`, function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
            if (result[0] && result[0].isAdmin) {
                const sql = `INSERT INTO Shoes (shoe_name, shoe_size, image_url, price, quantity, currency, category, description, create_at)` +
                    `VALUES ("${event["body-json"].shoe_name}", ${event["body-json"].shoe_size}, "${event["body-json"].image_url}", ${event["body-json"].price},` +
                    `${event["body-json"].quantity}, "${event["body-json"].currency}", "${event["body-json"].category}", "${event["body-json"].description}", CURDATE())`;
                console.log(sql);
                con.query(sql, function (err, result, fields) {
                    if (err) return reject(err);
                    resolve("Success");

                }
                )
            }
            else {
                resolve("User not an admin");

            }
        });

    });
};

// const testEvent = {
//     "body-json": {
//         "userId": 2,
//         "shoe_name": "Nike Air Force 1 Low '07",
//         "shoe_size": 10,
//         "image_url": "https://www.nike.com/ca/t/air-force-1-07-shoe-Dz225W/DD8959-001",
//         "price": 145,
//         "currency": "USD",
//         "category": "Shoes",
//         "description": "Connor's test shoe",
//         "quantity": 3
//     }
// }

// handler(testEvent).then((data) => console.log(data));

