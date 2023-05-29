// run this code in your console using node to generate a secret key
const crypto = require('crypto');

const key = crypto.randomBytes(32).toString('hex');
console.log(key);
