var mysql = require('mysql');

var con = mysql.createConnection({
    host: "shoe.cn8yo5jlq391.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "admin123",
    database: "shoe"
});

exports.handler = async (event) => {
    return new Promise((res, rej) => {

        console.log(event);

        var id = event["body-json"].user_id;
        console.log(id);

        var shoeId = event.item_id;
        console.log(shoeId);

        let querySel = `SELECT isAdmin FROM Users WHERE user_id = ${event["body-json"].userId}`;
        con.query(querySel, [id], function (err, result, fields) {
            if (err) {
                console.log(err);
                rej(err);
            }
            console.log(result);

            if (result[0].isAdmin == 1) {
                // console.log("inside delete");
                // let queryDel = `DELETE FROM Shoes WHERE shoe_id = ${shoeId}`;
                // con.query(
                //     queryDel, function (err, result, fields) {
                //         if (err) {
                //             console.log(err);
                //             rej(err);
                //         }
                //         const response = {
                //         statusCode: 200,
                //         body: result,
                //         };
                //         res(response);
                //     });
                con.query(`UPDATE Shoes SET isListed = 0 WHERE shoe_id = ${shoeId}`, function (err, result, fields) {
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
                rej("Failed.");
            }
        });


    })

};

