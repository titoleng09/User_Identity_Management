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
        const {
            name,
            firstname,
            email,
            password,
            role,
            phone,
            mobile
        } = req.body;

        // Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required"
            });
        }

        const response = await axios.post(
            "http://172.31.21.105:5002/users",
            {
                name: name || firstname,
                email,
                password,
                role,
                phone: phone || mobile
            }
        );

        return res.status(201).json({
            message: "Registration successful",
            user: response.data
        });

    } catch (error) {
        console.error("REGISTRATION ERROR:", error.message);

        // User service returned an error
        if (error.response) {
            return res.status(error.response.status).json({
                message: "Registration failed",
                error:
                    error.response.data?.message ||
                    error.response.data ||
                    "User service returned an error"
            });
        }

        // User service could not be reached
        return res.status(503).json({
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