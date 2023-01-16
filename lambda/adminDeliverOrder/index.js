var mysql = require('mysql');

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "shoe"
});

exports.handler = async (event) => {
  return new Promise((res, rej) => {
    // Query
    con.query("SELECT * FROM Orders \
               WHERE status = 'confirmed' \
               ORDER BY create_at DESC", (err, result, fields) => {
      if (err) return rej(err);

      const toBeUpdatedOrders = [];
      (result || []).forEach((order) => {
        if (Date.now() - (new Date(order.create_at)).getTime() > 5000) {
          toBeUpdatedOrders.push(order.order_id);
        }
      })

      console.log(toBeUpdatedOrders);
      con.query("UPDATE Orders \
                SET status = 'delivered' \
                WHERE order_id IN (?)", [toBeUpdatedOrders], (err, result, fields) => {
        if (err) return rej(err);

        const response = {
          statusCode: 200,
          body: JSON.stringify('Hello from Lambda!'),
        };
        res(response);
      });

    });
  })

};
