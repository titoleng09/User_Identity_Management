const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

const dbconnect = require('./dbconnect.js');

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
const axios = require("axios");

app.post(["/", "/register"], async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5002/users",
      {
        name: req.body.name || req.body.firstname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        phone: req.body.phone || req.body.mobile
      }
    );

    res.status(201).json({
      message: "Registration successful",
      user: response.data
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.response?.data?.message || error.message
    });
  }
});

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5003, () => console.log('EXPRESS Server Started at Port No: 5003'));
