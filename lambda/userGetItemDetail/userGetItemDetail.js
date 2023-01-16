var mysql = require("mysql");

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "shoe",
});

exports.handler = async (event) => {
  return new Promise((res, rej) => {
    con.connect(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected!");
      }
      let query = `SELECT * FROM Shoes WHERE shoe_id = ?`
      let data = con.query(query, [event.id], (err, result, fields) => {
        if (err)
          throw err
        const response = {
          statusCode: 200,
          body: result,
          };
        res(response);
      })
    });
  });
};