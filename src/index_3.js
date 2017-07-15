const express = require('express');
const redis = require('redis');
const process = require('process');

const config = require('./config');


let app = express();

let redisClient = redis.createClient(
    config.redis_host,
    config.redis_port
);

redisClient.client.set("dog:name:gizmo", "dog:1");
redisClient.client.set("dog:name:dexter", "dog:2");
redisClient.client.set("dog:name:fido", "dog:3");

redisClient.client.lpush("dog:age:5", ["dog:1", "dog:3"]);
redisClient.client.lpush("dog:age:6", "dog:2");

app.use((req, res, next) => {
   console.time("request");
   next();
});

app.get("/dog/name/:name", (req, res) => {
    // first find the id
    redis.get("dog:name:" + req.params.name)
        .then(redis.hgetall)
        .then(data => res.send(data));
    console.log.timeEnd('request');
});

app.get("/dog/age/:age", (req, res) => {
    redis.lrange("dog:age:" + req.params.age)
        .then(data => Promise.all(data.map(redis.hgetall)))
        .then(data => res.send(data));
    console.timeEnd("request");
});

app.listen(process.argv[2] || 8080);