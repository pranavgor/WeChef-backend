// For auth
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/users")

const authHelper = require('../helper/auth')

module.exports = function(router){
    
    var login = router.route('/login');
    var register = router.route('/register');
    var test = router.route('/test');
    var check = router.route('/isUserAuth');

    // Test API
    test.get(authHelper, async (req,res) => {
        console.log(req.user);
        res.json({
        message: "Success",
        username: req.user.username,
        userid: req.user.id
        })
    })
    
    register.post(async (req,res) => {
        console.log(req)
        const user = req.body.body;
        console.log(user)
        if(!user.username || !user.email || !user.password){
        res.json({message: "Please provide all registration details"}).send();
        return
        }
    
        const userName = await User.findOne({username: user.username})
        const email = await User.findOne({email: user.email})
        
        if(userName || email) {
        res.json({message: "Username or email taken"})
        }
        else{
        user.password = await bcrypt.hash(req.body.body.password, 10)
        const dbUser = new User({
            username: user.username,
            email: user.email,
            password: user.password
        })
    
        dbUser.save();
        res.json({message: "Success"});
        }
    
    })
    
    login.post(async (req,res) => {
        const userLogIn = req.body.body;
        User.findOne({username: userLogIn.username})
        .then(dbUser => {
        console.log(dbUser)
        if(!dbUser){
            return res.json({
            message: "Invalid Username or Password"
            }).send()
        }
        bcrypt.compare(userLogIn.password, dbUser.password)
        .then(isCorrect => {
            if(isCorrect){
            const payload = {
                id: dbUser._id,
                username: dbUser.username,
            }
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn: 86400}, 
                (err,token)=>{
                console.log(err,token)
                if(err) return res.json({message: "err"}).send()
                return res.json({
                    message: "Success",
                    token: "Bearer "+token
                }).send()
                })
            }
            else{
            return res.json({message: "Invalid Username or Password"}).send()
            }
        })
        })
    })
    
    check.get(authHelper, (req, res) => {
        return res.json({isLoggedIn: true, username: req.user.username})
    })
    
    



    return router;
}