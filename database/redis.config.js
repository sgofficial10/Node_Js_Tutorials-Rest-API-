const redis = require('redis');
const fs = require("fs");
// let content = fs.readFileSync('redis.json');
// let json_content = JSON.parse(content);

// const client = redis.createClient(json_content.redis_port, json_content.redis_host);

const client = redis.createClient({
    port : 6379,
    host : '127.0.0.1'
});

client.on('connect', function(){
    console.log('Redis client connected');
});

client.on('error', function(err){
    console.log('Redis client error' + err);
});


module.exports = client;