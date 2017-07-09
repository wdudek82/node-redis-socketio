const express = require('express');
const redis = require('redis');
const process = require('process');

const config = require('./config.js');


let app = express();

// connect to redis
let redisClient = redis.createClient(
    config.redis_port,
    config.redis_host
);

// redisClient.set('REDIS_KEY', '0');


app.get('/', (req, res) => {
    redisClient.incr('REDIS_KEY');
    redisClient.get('REDIS_KEY', (err, reply) => {
        let htmlTemplate = `<html><head><title>Page</title></head>
                  <body><h1>Our Redis and Express Web Application</h1>
                  <p>Redis count: ${reply}</p></body></html>`;
        res.send(htmlTemplate);
        res.end();
    });
});


let port = process.argv[2];

console.log(port);

app.listen(process.argv[2] || 8080);
// app.listen(8080);
