const express = require("express");
const process = require("process");
const redis = require("./redis");


let app = express();

// setup redis data
redis.client.flushall();
redis.client.hmset("dog:1", ["name", "gizmo", "age", "5"]);
redis.client.hmset("dog:2", ["name", "dexter", "age", "6"]);
redis.client.hmset("dog:3", ["name", "fido", "age", "5"]);

// we are using name like username, unique
redis.client.set("dog:name:gizmo", "dog:1");
redis.client.set("dog:name:dexter", "dog:2");
redis.client.set("dog:name:fido", "dog:3");

app.use((req, res, next) => {
    console.time('request');
    next();
});

app.get("/dog/name/:name", (req, res) => {
    let now = Date.now();
    let dogName = req.params.name;

    redis.client.zadd("dog:last-lookup", [now, "dog:name:" + dogName]);

    // first find the id
    redis.get("dog:name:" + dogName)
        .then(data => {
            redis.client.hset(data, "last-lookup", now);
            return data;
        })
        .then(redis.hgetall)
        .then(data => res.send(data));
    console.log(req.method);
    // console.log(req.query);
    // console.log(req.headers);
    console.timeEnd("request");
});

app.get("/dog/any", (req, res) => {
    redis.zrevrangebyscore("dog:last-lookup", "+inf", "-inf")
        .then(data => Promise.all(data.map(redis.get)))
        .then(data => Promise.all(data.map(redis.hgetall)))
        .then(data => res.send(data));
    console.timeEnd("request");
});

app.get("/dog/latest", (req, res) => {
    let now = Date.now();
    let minuteAgo = now - 60000;

    redis.zrevrangebyscore("dog:last-lookup", now, minuteAgo)
        .then(data => Promise.all(data.map(redis.get)))
        .then(data => Promise.all(data.map(redis.hgetall)))
        .then(data => res.send(data));
    console.timeEnd("request");
});

app.listen(process.argv[2] || 8080);
