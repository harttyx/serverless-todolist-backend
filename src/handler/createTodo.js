'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createTodo = (event, context, callback) => {

    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if (typeof data.task !== 'string') {
        console.error('Task is not a string');
        const response = {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: "Task is not a string." })
        }

        callback(null, response);
    }

    const params = {
        TableName: 'todos',
        Item: {
            id: uuid.v1(),
            task: data.task,
            done: false,
            createdAt: datetime,
            updatedAt: datetime
        }
    };

    dynamoDb.put(params, (error, data) => {
        if (error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(data.Items)
        };

        callback(null, response);
    })
}
