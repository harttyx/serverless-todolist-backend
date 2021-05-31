'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTodo = (event, context, callback) => {

    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if (!data) {
        console.error('Bad Request');
        const response = {
            statusCode: 400,
            body: JSON.stringify({ message: "Can't process this request" })
        }

        callback(null, response);
    }

    if (typeof data.done !== 'boolean') {
        console.error('Done is not a boolean');
        const response = {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: "Done is not a boolean." })
        }

        callback(null, response);
    }

    const params = {
        TableName: 'todos',
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeValues: {
            ':d': data.done,
            ':u': datetime
        },
        UpdateExpression: 'set done = :d, updatedAt = :u'
    };

    dynamoDb.update(params, (error, data) => {
        if (error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(data.Items)
        };

        callback(null, response);
    })
}
