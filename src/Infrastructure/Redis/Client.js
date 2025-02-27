const redis = require('redis');
const config = require('../../../config');

const client = redis.createClient(config.redis);

client.on('error', (err) => console.log('Error', err));
client.connect();
console.log('Connection is establishing now...');

module.exports = client;