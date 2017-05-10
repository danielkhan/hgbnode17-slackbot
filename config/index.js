'use strict';
require('dotenv').config();
const bunyan = require('bunyan');

const log = {

    development: () => {
        return bunyan.createLogger({
            name: 'slackbot-main-dev',
            level: 'debug'
        });
    },
    production: () => {
        return bunyan.createLogger({
            name: 'slackbot-main-prod',
            level: 'info'
        });
    },
    test: () => {
        return bunyan.createLogger({
            name: 'slackbot-main-test',
            level: 'fatal'
        });
    }
};

module.exports = {
    slackToken: process.env.SLACK_TOKEN,
    witToken: process.env.WIT_TOKEN,
    serviceTimeout: 30,
    botName: 'khan-bot',
    log: (env) => {
        if(env) return log[env]();
        return log[process.env.NODE_ENV || 'development']()
    }
}