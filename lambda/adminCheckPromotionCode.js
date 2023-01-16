var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var documentClient = new AWS.DynamoDB.DocumentClient();
var body;
var event;
var bodyJson;
var promoCode;
var result = {};

// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };

exports.handler = (event, context, callback) => {
    // TODO implement

    if (event.body !== null && event.body !== undefined) {
        let body = JSON.parse(event.body);
        console.log(body);
    }

    if (event !== null && event !== undefined) {
        // let event = JSON.parse(event);
        console.log(event);
        // bodyJson = event.body-json;
        // console.log(bodyJson);

        let bodyJson = event['body-json'];
        console.log(bodyJson);
        promoCode = bodyJson.promotionCode
        console.log(promoCode)
    }

    // var postChecker = event.body.

    var params = {
        TableName: "promotionCodeTable",
    };

    documentClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            //console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            console.log(data);
            let items = data.Items;
            result = { 'promoCode': promoCode, 'matched?': false, 'discount': 0 };
            for (let i = 0; i < items.length; i++) {
                console.log(items[i]);
                console.log(promoCode);
                console.log(items[i].promotionCode)
                if (promoCode === items[i].promotionCode) {
                    result = { 'promoCode': promoCode, 'matched?': true, 'discount': items[i].dollarsOff };
                }
            }

            response = sendRes(200, result)
            callback(null, JSON.parse(JSON.stringify(response, null, 2)));
        }
    });
};

const sendRes = (status, body) => {
    var response = {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "X-Requested-With": "*"
        },
        body: body
    };
    return response;
};
