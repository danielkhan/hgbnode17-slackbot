'use strict';

const request = require('superagent');

class WitClient {

    constructor(token) {
        this._token = token;
    }

    ask(message, cb) {

        request.get('https://api.wit.ai/message')
            .set('Authorization', 'Bearer ' + this._token)
            .query({ v: '20170424' })
            .query({ q: message})
            .end((err, res) => {
                if (err) return cb(err);

                if (res.statusCode !== 200) return cb('Expected 200 but got ' + res.statusCode);

                const witResponse = res.body.entities;
                return cb(null, witResponse);

            });

    }

}

module.exports = WitClient;