'use strict';

const request = require('superagent');

module.exports.process = function process(intentData, registry, log, cb) {
    
    if(intentData.intent[0].value !== 'time') 
        return cb(new Error('Expected time intent but got ' + intentData.intent[0].value));

    const location = intentData.location[0].value.replace(/,.?khan\-bot/i, '');



    const service = registry.get('time');
    if(!service) return cb(false, 'No service available');

    request.get(`http://${service.ip}:${service.port}/service/${location}`)
    .then((res) => {
        if(!res.body.result) return cb('Error with time service');
        return cb(null, `In ${location} is is now ${res.body.result}`);
    });

}