const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const axios = require('axios');

require('./dbconnect.js');

app.use(bodyParser.json());

const USER_SERVICE = "http://172.31.28.20:5002";

app.get("/", (req, res) => {
    res.send("Hello Admin");
});

app.get("/searchuser", async (req, res) => {
    try {
        const { name, email } = req.query;

        const response = await axios.get(
            `${USER_SERVICE}/users/search`,
            {
                params: {
                    name,
                    email
                }
            }
        );

        res.status(200).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(
                error.response.data
            );
        }

        res.status(500).json({
            message: "User service unavailable"
        });
    }
});

app.get("/viewallusers", async (req, res) => {
    try {
        const response = await axios.get(
            `${USER_SERVICE}/users`
        );

        res.status(200).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(
                error.response.data
            );
        }

        res.status(500).json({
            message: "User service unavailable"
        });
    }
});

app.delete("/deleteuser", async (req, res) => {
    try {
        const { email } = req.query;

        const response = await axios.delete(
            `${USER_SERVICE}/users/${encodeURIComponent(email)}`
        );

        res.status(200).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(
                error.response.data
            );
        }

        res.status(500).json({
            message: "User service unavailable"
        });
    }
});

app.listen(5001, () => {
    console.log('EXPRESS Server Started at Port No: 5001');
});