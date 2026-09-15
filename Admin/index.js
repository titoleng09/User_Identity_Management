const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const axios = require('axios');

app.get("/", (req,res) => {
    res.send("Hello Admin")
})

app.get("/searchuser", async(req,res) => {
     try {

        const { name, email } = req.query;

        const response = await axios.get(
            "http://localhost:5002/users/search",
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
})
app.get("/viewallusers",async (req, res) => {

    try {

        const response = await axios.get(
            "http://localhost:5002/users"
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
})

app.delete("/deleteuser", async (req, res) => {

    try {

        const { email } = req.query;

        const response = await axios.delete(
            `http://localhost:5002/users/${encodeURIComponent(email)}`
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
})

app.get("/user/viewprofile", async (req, res) => {

    try {

        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                message: "User ID not provided"
            });
        }

        const user = await userModel.findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile retrieved successfully",
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
});


app.put("/user/updateprofile", async (req, res) => {

    try {

        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                message: "User ID not provided"
            });
        }

        const { name, email, phone, password } = req.body;

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (email) {
            updateData.email = email;
        }

        if (phone) {
            updateData.phone = phone;
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
});


// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5001, () => console.log('EXPRESS Server Started at Port No: 5001'));
