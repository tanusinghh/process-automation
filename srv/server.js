const cds = require('@sap/cds');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

cds.on('bootstrap', (app) => {
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
});

// Start the server





