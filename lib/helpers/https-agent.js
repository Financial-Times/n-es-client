const https = require('https');
const keepAliveAgent = new https.Agent({ keepAlive: true });

module.exports = keepAliveAgent;
