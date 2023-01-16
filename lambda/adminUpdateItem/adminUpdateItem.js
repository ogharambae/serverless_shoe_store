var mysql = require('mysql');

var con = mysql.createConnection({
    host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "admin123",
    database: "shoe"
});

exports.handler = async (event) => {
    return new Promise((res, rej) => {
        var shoeId = event.shoe_id;
        var price = event["body-json"].price;
        var quantity = event["body-json"].quantity;
        console.log(price);
        console.log("quantity", quantity)

        con.query(`SELECT isAdmin FROM Users WHERE user_id = ${event["body-json"].userId}`, function (err, result, fields) {
            if (err) throw err;
            if (result[0] && result[0].isAdmin === 1) {
                let queryUpdate;
                if (price !== undefined && quantity !== undefined) {
                    queryUpdate = `UPDATE Shoes SET price = ${price}, quantity = ${quantity} WHERE shoe_id = ${shoeId}`;
                } else if (price !== undefined) {
                    queryUpdate = `UPDATE Shoes SET price = ${price} WHERE shoe_id = ${shoeId}`;
                } else if (quantity !== undefined) {
                    queryUpdate = `UPDATE Shoes SET quantity = ${quantity} WHERE shoe_id = ${shoeId}`;
                } else {
                    rej("Need a new price and/or quantity");
                }

                con.query(
                    queryUpdate,
                    function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            rej(err);
                        }
                        const response = {
                            statusCode: 200,
                            body: result,
                        };
                        res(response);
                    });
            } else {
                const response = {
                    statusCode: 403,
                    msg: "Unauthorized",
                };
                res(response);
            }
        });
    })

};