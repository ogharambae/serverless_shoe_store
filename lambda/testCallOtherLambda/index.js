var AWS = require('aws-sdk');

// Set the region 
var lambda = new AWS.Lambda({
  region: 'us-east-1'
});

exports.handler = async (event) => {
  return new Promise((res, rej) => {
    lambda.invoke({
      FunctionName: 'sendOrderToOrderQueue',
      Payload: JSON.stringify(event, null, 2) // pass params
    }, function (error, data) {
      if (error) {
        return res({ error })
      }
      if (data) {
        return res({ msg: "Successfully added to the queue", data })
      }

      return res("ohohooh");
    });
  })

};
