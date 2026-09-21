const express = require('express');
var app = express();
require('dotenv').config()

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const userModel = require('./user_schema.js');
const bcrypt = require("bcrypt");

app.get("/",  (req,res) => {
    res.send("User Page")
})

app.get("/users/email/:email", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users", async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/users", async (req, res) => {
  try {

    const { name, email, password, role, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone
    });

    res.status(201).json({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }});

app.get("/email/:email", async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.params.email
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.get("/users/search", async (req, res) => {
    try {
        const { name, email } = req.query;

        let query = {};

        if (name) {
            query.name = {
                $regex: name,
                $options: "i"
            };
        }

        if (email) {
            query.email = {
                $regex: email,
                $options: "i"
            };
        }

        const users = await userModel.find(query).select("-password");

        if (users.length === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.status(200).json({
            message: "User Found",
            users
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/users/viewprofile", async (req, res) => {

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

app.put("/users/updateprofile", async (req, res) => {

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

        // Hash password if user wants to change it
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
app.listen(5002, () => console.log('EXPRESS Server Started at Port No: 5002'));
