const cds = require('@sap/cds');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Increase the body size limit
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Integrate with CAP
cds.on('bootstrap', (app) => {
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
});

// Start the server





