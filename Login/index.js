const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

app.use(express.urlencoded({ extended: false }));

require('./dbconnect.js');

const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Hello Login");
});


// LOGIN API
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
            `http://172.31.28.20:5002/users/email/${encodeURIComponent(email)}`
        );

        const user = response.data;

        // Check role
        if (user.role !== role) {
            return res.status(401).json({
                message: "Invalid email or password or role"
            });
        }

        // Compare password
        const passwordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatched) {
            return res.status(401).json({
                message: "Invalid email or password or role"
            });
        }

        const jwt_scret = "CXf97UB3LK6BZjxmBhnwGrkPiBTZ0WxKYxOzK0t2YFr"

        // Generate JWT
        const token = jwt.sign(
            {
                sub: user._id,
                email: user.email,
                role: user.role
            },
            jwt_scret,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid email or password or role"
        });
    }
});


// START SERVER
app.listen(5004, () => {
    console.log('EXPRESS Server Started at Port No: 5004');
});