const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

require('./dbconnect.js');

const axios = require("axios");


// REGISTER API
app.post(["/", "/register"], async (req, res) => {
    try {

        const response = await axios.post(
            "http://172.31.21.105:5002/users",
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

        console.error("REGISTRATION ERROR:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                message: "Registration failed",
                error: error.response.data?.message || error.response.data
            });
        }

        res.status(500).json({
            message: "Registration failed",
            error: "User service unavailable"
        });
    }
});


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Hello Register");
});


// START SERVER
app.listen(5003, () => {
    console.log('EXPRESS Server Started at Port No: 5003');
});