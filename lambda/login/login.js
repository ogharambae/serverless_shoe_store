var mysql = require("mysql");

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "shoe",
});

exports.handler = async (event) => {
  const username = event["body-json"].username.toLowerCase();
  const password = event["body-json"].password;
  return new Promise((res, rej) => {
    con.connect(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected!");
      }
      console.log(event);

      con.query(
        `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}' `,
        function (err, result, fields) {
          if (err) throw err;
          if (result.length != 0) {
            const response = {
              statusCode: 200,
              body: result,
            };
            res(response);
          } else {
            const response = {
              statusCode: 403,
              body: JSON.stringify("Incorrect Credentials: Login Failed"),
            };
            res(response);
          }
        }
      );
    });
  });
};
