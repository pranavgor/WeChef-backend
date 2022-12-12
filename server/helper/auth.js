const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

module.exports = function authenticateUser(req,res,next){
        console.log(req)
        const headers = (req.body.headers)? req.body.headers: req.headers
        const token = headers["x-access-token"]?.split(' ')[1]
        console.log(token)
        
        if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
            if(err) return res.json({
            ifLoggedIn: false,
            message: "Failed to authenticate user"
            }).send()
            req.user = {};
            req.user.id = decoded.id;
            req.user.username = decoded.username;
            next()
        })
        }
        else{
        res.json({
            message: "Incorrect token supplied",
            isLoggedIn: false
        }).send()
        }
    }
