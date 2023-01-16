var mysql = require("mysql");
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });
const LOW_STOCK_SES_THRESHOLD = 3;
const ADMIN_EMAIL = "serverless4968shoestore@gmail.com";

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "shoe",
});

exports.handler = (event) => {
  return new Promise((res, rej) => {
    if (!event || !event.Records || !event.Records.length) {
      return res({}); // Ignore if the queue message has no information for order
    }
    const data = JSON.parse(event.Records[0].body);
    console.log(data);
    if (!data || !data.shoes) return res({});
    const shoes = data.shoes;
    const expectedNewStock = {};
    const checkStockQuery = `SELECT quantity FROM Shoes WHERE shoe_id = ?`;
    const checkStock = new Promise((res, rej) => {
      const outOfStock = { shoes: [] };
      for (let i = 0; i < shoes.length; i++) {
        con.query(
          checkStockQuery,
          [shoes[i].shoe_id],
          (err, result, fields) => {
            if (err) return rej(err);

            if (!result.length || result[0].quantity < shoes[i].quantity) {
              outOfStock.shoes.push({
                shoe_id: shoes[i].shoe_id,
                currentQuantity: result.length ? result[0].quantity : 0,
                neededQuantity: shoes[i].quantity,
              });
            } else if (
              result.length &&
              result[0].quantity >= shoes[i].quantity
            ) {
              expectedNewStock[shoes[i].shoe_id] =
                result[0].quantity - shoes[i].quantity;
            }

            if (i === shoes.length - 1) {
              res(outOfStock);
            }
          }
        );
      }
    });

    checkStock.then((doc, err) => {
      console.log(expectedNewStock);
      console.log(doc);
      if (err) return rej(err);

      // Parse data for email
      const userEmail = data.shipping.email;
      let parsedData = data;
      parsedData.shoes.forEach((shoe) => {
        shoe.image_url = shoe.image_url[0];
        shoe.price = shoe.price.toFixed(2);
      });
      if (parsedData.discount == 0) {
        delete parsedData.discount;
      } else {
        parsedData.discount = parseFloat(parsedData.discount).toFixed(2);
      }

      if (doc.shoes && doc.shoes.length) {
        // Out of stock
        con.query("UPDATE Orders SET status = 'canceled' WHERE order_id = ?", [
          data.order_id,
        ]);

        // Send email out of stock
        var cancelEmailSESParams = {
          Destination: {
            ToAddresses: [userEmail],
          },
          TemplateData: JSON.stringify(parsedData),
          Source: ADMIN_EMAIL,
          Template: "order-cancellation"
        };
        var sendSESCancellationPromise = ses.sendTemplatedEmail(cancelEmailSESParams).promise();
        sendSESCancellationPromise.then(
          function(data) {
            console.log(data.MessageId);
            console.log("out of stock - email sent");
            res({ statusCode: 200, body: doc });
          }).catch(
            function(err) {
              console.error(err, err.stack);
              res({ statusCode: 500 })
            }
          )
      } else {
        const lowStockShoe = [];
        // Update the stock based on the quantity of order
        const promisesUpdate = [];
        for (let i = 0; i < shoes.length; i++) {
          promisesUpdate.push(
            new Promise((resolve, rej) => {
              con.query(
                "UPDATE Shoes SET quantity = ? WHERE shoe_id = ?",
                [expectedNewStock[shoes[i].shoe_id], shoes[i].shoe_id],
                () => {
                  resolve(0);
                }
              );
            })
          );
          if (expectedNewStock[shoes[i].shoe_id] < LOW_STOCK_SES_THRESHOLD) {
            let shoeWithExpectedNewStock = shoes[i];
            shoeWithExpectedNewStock.quantity = expectedNewStock[shoes[i].shoe_id]
            lowStockShoe.push(shoeWithExpectedNewStock);
          }
        }
        if (lowStockShoe.length > 0) {
          console.log(lowStockShoe);
          let lowStockShoeJson = {shoes: lowStockShoe}
          var lowStockEmailSESParams = {
            Destination: {
              ToAddresses: [ADMIN_EMAIL],
            },
            TemplateData: JSON.stringify(lowStockShoeJson),
            Source: ADMIN_EMAIL,
            Template: "admin-low-stock"
          };
          promisesUpdate.push(ses.sendTemplatedEmail(lowStockEmailSESParams).promise());
        }
        promisesUpdate.push(
          new Promise((resolve, reject) => {
            con.query(
              "UPDATE Orders SET status = 'confirmed' WHERE order_id = ?",
              [data.order_id],
              () => {
                resolve(0);
              }
            );
          })
        );
        Promise.all(promisesUpdate).then(() => {
          console.log("Updated stock successfully");

          // Send email confirmation
          var confirmEmailSESParams = {
            Destination: {
              ToAddresses: [userEmail],
            },
            TemplateData: JSON.stringify(parsedData),
            Source: ADMIN_EMAIL,
            Template: "order-confirmation"
          };
          var sendSESConfirmationPromise = ses.sendTemplatedEmail(confirmEmailSESParams).promise();
          sendSESConfirmationPromise.then(
            function(data) {
              console.log(data.MessageId);
              console.log("order confirmation - email sent");
              res({ statusCode: 200, body: doc });
            }).catch(
              function(err) {
                console.error(err, err.stack);
                res({ statusCode: 500 })
              }
            )
        });
      }
    });
  });
};
