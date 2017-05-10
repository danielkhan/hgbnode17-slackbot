'use strict';

const request = require('superagent');

module.exports.process = function process(intentData, log, cb) {
    
    if(intentData.intent[0].value !== 'time') 
        return cb(new Error('Expected time intent but got ' + intentData.intent[0].value));

    const location = intentData.location[0].value;

    request.get('http://127.0.0.1:3001/service/' + location)
    .then((res) => {
        if(!res.body.result) return cb('Error with time service');
        return cb(null, `In ${location} is is now ${res.body.result}`);
    });

}