const router = require('express').Router();
const User =  require("../model/User");
const Crypto = require('crypto-js');
const jwt = require("jsonwebtoken"); 

router.post("/register", async (req, res) => {
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : Crypto.AES.encrypt(
            req.body.password, 
            process.env.SECRET_KEY
        ).toString(),
    });

    try {
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/login' , async (req, res) => {
    try {
        const user = await User.findOne({
            email : req.body.email,
        });
        !user && res.status(401).json("Invalid Credentials");

        const pwd = Crypto.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = pwd.toString(Crypto.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json("Invalid Credentials"); 

        const accessToken = jwt.sign(
            {id : user._id , isAdmin : user.isAdmin} ,
            process.env.SECRET_KEY ,
            {expiresIn : "1d"}
        ); 

        const{ password , ...info} = user._doc;

        res.status(200).json({ ...info , accessToken})
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
});

module.exports = router;