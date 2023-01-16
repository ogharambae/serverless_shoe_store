var mysql = require('mysql');

var con = mysql.createConnection({
    host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "admin123",
    database: "shoe"
});

exports.handler = async (event) => {
    return new Promise((res, rej) => {
        var userId = event.user_id;
        console.log(userId);
        let queryGetOrders = `SELECT * FROM ShoeOrder
                                  LEFT JOIN Orders ON ShoeOrder.order_id = Orders.order_id WHERE user_id = ?`;
        con.query(queryGetOrders, [userId], function (err, orderId, fields) {
            if (err) {
                console.log(err);
            }
            let response = {
                statusCode: 200,
                body: orderId,
            };
            res(response);
        });
    });
};