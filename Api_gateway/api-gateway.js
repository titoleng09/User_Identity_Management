const express = require('express');
const app = express();

const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

// USE PROXY SERVER TO REDIRECT INCOMING REQUEST
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

const { authenticateToken, authorizeRole } = require("./auth.js");


app.use('/login', (req, res) => {

    console.log("INSIDE API GATEWAY LOGIN ROUTE");

    proxy.web(req, res, {
        target: 'http://localhost:5004'
    });

});

app.use('/reg', (req, res) => {

    console.log("INSIDE API GATEWAY REG ROUTE");

    proxy.web(req, res, {
        target: 'http://localhost:5003'
    });

});

app.use(
    '/ad',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        console.log("INSIDE API GATEWAY ADMIN ROUTE");

        proxy.web(req, res, {
            target: 'http://172.31.26.170:5001'
        });

    }
);

app.use(
    '/user',
    authenticateToken,
    authorizeRole(['admin', 'user', 'student']),
    (req, res) => {

        console.log("INSIDE API GATEWAY USER ROUTE");

        req.url = `/users${req.url}`;

        proxy.web(req, res, {
            target: 'http://172.31.21.105:5002'
        });

    }
);

proxy.on('error', (error, req, res) => {

    console.error(`Proxy request failed: ${error.code}`);

    if (!res.headersSent) {
        res.writeHead(502, {
            'Content-Type': 'application/json'
        });
    }

    res.end(JSON.stringify({
        error: 'Service unavailable'
    }));

});


const port = process.env.PORT || 5005;

app.listen(port, () => {
    console.log(
        "API Gateway Service is running on PORT NO : ",
        port
    );
});