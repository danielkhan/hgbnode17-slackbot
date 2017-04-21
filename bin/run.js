'use strict';

const config = require('../config');
const log = config.log();
const service = require('../server/service')(config);
const SlackClient = require('../server/SlackClient');
const http = require('http');
const server = http.createServer(service);

const slackClient = new SlackClient(config.slackToken, config.botName, 'info', log);

slackClient.start(() => {
    server.listen(process.env.PORT || 3000);
});


server.on('listening', function() {
    log.info(`Slackbot is listening on ${server.address().port} in ${service.get('env')} mode`);
});