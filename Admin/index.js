const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const AdminModel = require('./admin_schema.js');


app.get("/", (req,res) => {
    res.send("Hello Admin")
})

app.get("/ad", (res,res) => {
    res.send("Send some requests")
})

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5001, () => console.log('EXPRESS Server Started at Port No: 5001'));
