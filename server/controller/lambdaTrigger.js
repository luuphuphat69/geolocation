var aws = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: 'us-east-1'
});

const lambdaTrigger = {
    writetodb: async (req, res) => {
        const lambda = new aws.Lambda();
        const mail = req.body.params?.mail;
        const lat = req.body.params?.lat;
        const long = req.body.params?.long;
        const city = req.body.params?.city;


        const isMailExisted = await checkSubscribedMail(mail);
        if (isMailExisted && isMailExisted.length > 0) {
            return res.status(281).send(isMailExisted[0]);
        } else {
            const params = {
                FunctionName: 'writetodb',
                Payload: JSON.stringify({
                    mail: mail,
                    city: city,
                    lat: lat,
                    long: long
                })
            };

            lambda.invoke(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    res.status(500).send("Error invoking Lambda function");
                } else {
                    res.status(200).send("Lambda function invoked successfully");
                }
            });
        }
    },
    unsubcribe: async (req, res) => {
        const lambda = new aws.Lambda();
        const id = req.body.params?.id;
        const mail = req.body.params?.mail;

        const params = {
            FunctionName: "sendDeactiveMail",
            Payload: JSON.stringify({
                id: id,
                mail: mail
            })
        };

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                res.status(500).send("Error invoking function");
            } else {
                console.log(data);
                res.status(200).send("Lambda function invoked successfully");
            }
        });
    }
};

async function checkSubscribedMail(email) {
    const dynamoClient = new aws.DynamoDB.DocumentClient();
    const params = {
        TableName: "SubcribeEmail",
        FilterExpression: "Mail = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    };

    try {
        const data = await dynamoClient.scan(params).promise(); // scan retrieves all items, filtered by Mail
        return data.Items;
    } catch (error) {
        console.error("Error querying item:", error);
        return null;
    }
}


module.exports = lambdaTrigger;