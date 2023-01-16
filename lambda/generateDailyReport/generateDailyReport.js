var mysql = require("mysql");
var AWS = require("aws-sdk");
const { json } = require("express");

AWS.config.update({ region: "us-east-1" });
// var sns = new AWS.SNS();

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "shoe",
});

exports.handler = async (event) => {
  return new Promise((res, rej) => {
    var date = new Date();
    var getDatePst = date
      .toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
      .split(",")[0];
    var year = getDatePst.split("/")[2];
    var month = getDatePst.split("/")[0];
    var date = getDatePst.split("/")[1];
    const currentDate = year + "-" + month + "-" + date;
    console.log("PST: " + currentDate);

    var queryGetTodaysOrders = `SELECT * FROM Orders WHERE DATE(create_at) = ?`;
    con.query(
      queryGetTodaysOrders,
      [currentDate],
      function (err, result, fields) {
        if (err) {
          console.log(err);
        }

        var message = {};
        var Cancelled_Orders = 0;
        var Total_Sales_Amount = 0;

        result.forEach((element) => {
          console.log(element);
          if (element.status == "canceled") {
            Cancelled_Orders++;
            Total_Sales_Amount += element.amount;
          } else {
            Total_Sales_Amount += element.amount;
          }
        });

        // console.log(Total_Sales_Amount, cancelled_Orders);

        Object.assign(message, {
          Total_Orders: result.length,
          Total_Sales_Amount: Total_Sales_Amount,
          Cancelled_Orders: Cancelled_Orders,
        });

        var parsedMessage = `There are ${message.Total_Orders} total orders, with a total of $${message.Total_Sales_Amount.toFixed(2)} revenue, and ${message.Cancelled_Orders} cancelled orders for ${new Date().toLocaleDateString()}.`

        var params = {
          Subject: "Daily sales Report",
          //   Message: "Test message",
          Message: parsedMessage,
          TopicArn: "arn:aws:sns:us-east-1:536818800078:generateReport",
        };

        // Create promise and SNS service object
        var publishTextPromise = new AWS.SNS().publish(params).promise();
        publishTextPromise
          .then(function (data) {
            console.log(
              `Message ${params.Message} sent to the topic ${params.TopicArn}`
            );
            console.log("MessageID is " + data.MessageId);
            const response = {
              statusCode: 200,
              body: result,
            };
            res(response);
          })
          .catch(function (err) {
            console.error(err, err.stack);
            res(err);
          });
      }
    );
  });
};
