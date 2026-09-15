const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const UserModel = require('./user_schema.js');

/*
In the postman use the following URL
localhost:5000/reg

{
  "firstname":"Joe",
  "email":"a@gmail.com",
  "password":"abc",
  "mobile": 12345678,
  "role": "student"
}

*/
//REG API
app.get("/", (req,res) => {
    res.send("Hello Register")
})

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5004, () => console.log('EXPRESS Server Started at Port No: 5001'));
