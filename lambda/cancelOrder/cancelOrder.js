var mysql = require('mysql');

var con = mysql.createConnection({
    host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "admin123",
    database: "shoe"
});

exports.handler = async (event) => {
    return new Promise((res, rej) => {
        con.connect(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Connected!");
            }

            var orderId = event.order_id;
            let queryCancelOrder = `UPDATE Orders SET status='canceled' WHERE order_id = ?`
            con.query(queryCancelOrder, [orderId], function (err, result, fields) {
                if (err) {
                    console.log(err);
                }
                console.log(result);

                const response = {
                    statusCode: 200,
                    body: result,
                }
                res(response);

            })
        });
    })

};
