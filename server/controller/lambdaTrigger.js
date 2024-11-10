var aws = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
aws.config.update({accessKeyId: process.env.ACCESS_KEY, secretAccessKey: process.env.SECRET_KEY, region:'us-east-1'});

const lambdaTrigger = {
    writetodb: async (req, res) => {
        const lambda = new aws.Lambda();
        const mail = req.query.mail;

        const params = {
            FunctionName: 'writetodb',
            Payload: JSON.stringify({ mail })
        };
        
        lambda.invoke(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                res.status(500).send("Error invoking Lambda function");
            } else {
                console.log(data);
                res.status(200).send("Lambda function invoked successfully");
            }
        });
    }
};

module.exports = lambdaTrigger;