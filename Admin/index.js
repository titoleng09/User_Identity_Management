const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const AdminModel = require('./admin_schema.js');


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

app.delete("/deleteuser", (req,res) => {

})

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5001, () => console.log('EXPRESS Server Started at Port No: 5001'));
