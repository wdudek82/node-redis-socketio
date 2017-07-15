const express = require('express');
const redis = require('redis');
const process = require('process');

const config = require('./config');


let app = express();

// connect to redis
let redisClient = redis.createClient(
    config.redis_host,
    config.redis_port
);

let publishClient = redis.createClient(
    config.redis_host,
    config.redis_port
);

redisClient.on('message', (channel, message) => {
   console.log(message);
});

redisClient.subscribe('REQUEST');

app.get('/', (req, res) => {
    publishClient.publish(
        'REQUEST', `Request on ${req.socket.localPort} for ${req.url}`
    );
    console.log(`Local log for ${req.url}`);
    res.end();
});

app.listen(process.argv[2] || 8080);