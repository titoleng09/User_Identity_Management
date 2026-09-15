const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());
require('dotenv').config();
app.use(express.urlencoded({extended:false}));

const dbconnect = require('./dbconnect.js');
// const UserModel = require('./user_schema.js');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

app.post(["/", "/log"], async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate role
    if (!["admin", "user", "student"].includes(role)) {
      return res.status(400).json({
        message: "Role must be admin, user, or student"
      });
    }

    // Ask User Service to find the user
    const response = await axios.get(
      `http://localhost:5002/users/email/${encodeURIComponent(email)}`
    );

    const user = response.data;

    // Check role
    if (user.role !== role) {
      return res.status(401).json({
        message: "Invalid email or password or role"
      });
    }

    // Compare plain password with hashed password
    const passwordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid email or password or role"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        sub: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error.message);

    return res.status(401).json({
      message: "Invalid email or password or role"
    });
  }
});

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5004, () => console.log('EXPRESS Server Started at Port No: 5004'));
