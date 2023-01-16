var mysql = require("mysql");

var con = mysql.createConnection({
  host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "shoe",
});

exports.handler = async (event) => {
  console.log(event);
  const username = event["body-json"].username.toLowerCase();
  const password = event["body-json"].password;
  const email = event["body-json"].email;
  const isAdmin = event["body-json"].isAdmin;

  console.log(event.username);
  return new Promise((res, rej) => {
    con.connect(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected!");

        let checkuser = `SELECT * FROM Users WHERE username = '${event["body-json"].username}' AND password = '${event["body-json"].password}' `;

        con.query(checkuser, function (err, result, fields) {
          if (err) throw err;
          if (result.length != 0) {
            const response = {
              statusCode: 400,
              sucess: false,
              body: "username already exists. try a different name",
            };
            res(response);
          } else {
            let sql = `INSERT INTO Users(username,password,email,isAdmin) VALUES('${username}','${password}','${email}','${isAdmin}')`;

            con.query(sql, function (err, result, fields) {
              if (err) throw err;
              console.log(result);
              if (result.affectedRows == 1) {
                const response = {
                  statusCode: 200,
                  sucess: true,
                  body: "Created account sucessfully",
                };

                res(response);
              } else {
                const response = {
                  statusCode: 400,
                  sucess: false,
                  body: "Failed to create acount",
                };
                res(response);
              }
            });
          }
        });
      }
    });
  });
};
