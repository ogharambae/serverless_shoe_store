var AWS = require('aws-sdk');

// Set the region 
AWS.config.update({ region: 'us-east-1' });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });


exports.handler = async (event) => {
  return new Promise((res, rej) => {
    const timestamp = (new Date().getTime()).toString();
    var params = {
      MessageBody: JSON.stringify(event),
      MessageAttributes: {},
      MessageDeduplicationId: timestamp,  // Order Id
      MessageGroupId: timestamp,
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/536818800078/OrderQueue.fifo"
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.log("Error", err);
        return res({ error: err });
      } else {
        console.log("Success", data.MessageId);
        return res({ data: data.MessageId });
      }
    });
  })

};
