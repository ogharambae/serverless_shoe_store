var mysql = require("mysql");
var AWS = require("aws-sdk");

lambda = new AWS.Lambda({
  region: "us-east-1",
});

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "shoe",
});

exports.handler = async (event) => {
  const body = event;
  const discount = event.discount || 0;

  return new Promise((res, rej) => {
    // Get the price of each shoe from Shoes table
    const getShoePrices = `SELECT shoe_id, price FROM Shoes WHERE shoe_id in (?)`;
    con.query(
      getShoePrices,
      [body.shoes.map((shoe) => shoe.shoe_id)],
      (err, result, fields) => {
        if (err) throw err;
        // Create new array of objects with quantity & price
        const shoeOrder = body.shoes;
        shoeOrder.forEach((shoe) => {
          result.forEach((shoeWithPrice) => {
            if (shoe.shoe_id === shoeWithPrice.shoe_id)
              shoe.price = shoeWithPrice.price;
          });
        });

        // Check if every shoe has a price property
        for (let i = 0; i < shoeOrder.length; i++) {
          if (!shoeOrder[i].hasOwnProperty("price")) {
            return rej(
              `shoe_id: ${shoeOrder[i].shoe_id} does not exist in database.`
            );
          }
        }

        // Get total price
        let totalAmount = 0;
        shoeOrder.forEach((shoe) => {
          totalAmount += +shoe.quantity * +shoe.price;
        });
        let totalBeforeDiscount = totalAmount;
        // Deduct discount value if have
        totalAmount -= discount;

        console.log(totalAmount);

        // Create Orders row
        const createOrder =
          `INSERT INTO Orders (user_id, amount, promocode, currency, create_at, status)` +
          `VALUES (${body.user_id}, ${totalAmount}, NULLIF("${body.promo}", "undefined"), "CAD", CURRENT_TIMESTAMP(), "PENDING")`;
        con.query(createOrder, (err, result, fields) => {
          if (err) throw err;
          // Create ShoeOrders row
          const createShoeOrder = `INSERT INTO ShoeOrder (order_id, shoe_id, quantity, amount, currency, create_at) VALUES ?`;
          const createShoeOrderValues = [];
          // Create Array of arrays of ShoeOrder values for the current order
          shoeOrder.forEach((shoe) => {
            createShoeOrderValues.push([
              result.insertId,
              shoe.shoe_id,
              shoe.quantity,
              shoe.price * shoe.quantity,
              "CAD",
              new Date(),
            ]);
          });
          con.query(
            createShoeOrder,
            [createShoeOrderValues],
            (err, _, fields) => {
              if (err) throw err;
              const body = JSON.stringify(
                {
                  order_id: result.insertId,
                  totalWithDiscount: totalAmount.toFixed(2),
                  total: totalBeforeDiscount.toFixed(2),
                  ...event,
                },
                null,
                2
              );
              console.log(body);
              // Send order to queue
              lambda.invoke(
                {
                  FunctionName: "sendOrderToOrderQueue",
                  Payload: body, // pass params
                },
                function (error, data) {
                  if (error) {
                    return res({ error });
                  }

                  const response = {
                    statusCode: 200,
                    body: "Successfully placed pending order.",
                  };
                  return res(response);
                }
              );
            }
          );
        });
      }
    );
  });
};
