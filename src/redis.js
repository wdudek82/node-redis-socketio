const config = require("./config");
const redis = require("redis");


let client = redis.createClient(config.redis_host, config.redis_port);

function promiser(resolve, reject) {
    return (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    };
}

function aroundLoc(long, lat, miles) {
    return new Promise((resolve, reject) => {
        client.georadius(
            "places",
            long,
            lat,
            miles,
            "mi",
            "WITHDIST",
            promiser(resolve, reject)
        );
    })
}

function aroundSB(miles) {
    return new Promise((resolve, reject) => {
       client.georadiusbymember(
           "places",
           "South Bend",
           miles,
           "mi",
           "WITHDIST",
           promiser(resolve, reject)
       );
    });
}

function get(key) {
    return new Promise((resolve, reject) => {
        client.get(key, promiser(resolve, reject));
    });
}

function hgetall(key) {
    return new Promise((resolve, reject) => {
        if (key === null) {
            reject();
        }
        client.hgetall(key, promiser(resolve, reject));
    });
}

function lrange(key) {
    return new Promise((resolve, reject) => {
        client.lrange(key, [0, -1], promiser(resolve, reject));
    });
}

function zrevrangebyscore(key, max, min) {
    return new Promise((resolve, reject) => {
        client.zrevrangebyscore(key, max, min, promiser(resolve, reject));
    })
}

module.exports.aroundLoc = aroundLoc;
module.exports.aroundSB = aroundSB;
module.exports.get = get;
module.exports.hgetall = hgetall;
module.exports.lrange = lrange;
module.exports.zrevrangebyscore = zrevrangebyscore;
module.exports.client = client;
