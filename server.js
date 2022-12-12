require('dotenv').config()

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const router = express.Router();
// For auth
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("./models/users")
const bodyParser = require("body-parser")

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// get driver connection
 
const urlencodedParser = bodyParser.urlencoded({ extended: false})
app.use(bodyParser.json(), urlencodedParser)

const uri = "mongodb+srv://pranavgor:mydatabase@cluster0.cmpsmez.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


// Use routes as a module (see index.js)
require('./routes')(app, router);

