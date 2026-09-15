const express = require('express');
const app = express()

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer();

// proxy.on('error', (error, req, res) => {
//     console.error(`Proxy request failed: ${error.code}`)
//     if (!res.headersSent) {
//         res.writeHead(502, { 'Content-Type': 'application/json' })
//     }
//     res.end(JSON.stringify({ error: 'Service unavailable' }))
// })

//REDIRECT TO THE STUDENT MICROSERVICE
app.use('/login', (req, res) => {
    console.log("INSIDE API GATEWAY STUDENT ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5004' });
})

app.use('/reg', (req, res) => {
    console.log("INSIDE API GATEWAY REG ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5003' });
})
app.use('/ad', (req, res) => {
    console.log("INSIDE API GATEWAY ADMIN ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5001' });
})
app.use('/user', (req, res) => {
    console.log("INSIDE API GATEWAY USER ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5002' });
})

const port = process.env.PORT || 5005;

app.listen(port, () => {
    console.log("API Gateway Service is running on PORT NO : ", port)
})