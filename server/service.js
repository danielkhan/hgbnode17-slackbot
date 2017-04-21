'use strict';

const express = require('express');
const service = express();

module.exports = (config) => {

    const log = config.log();

    service.get('/', (req, res) => {
        return res.json({hello: 'world'});
    });

    return service;

}