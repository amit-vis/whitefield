const Admin = require("../model/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { publishToQueue } = require("../config/rabbitMq");

module.exports.create = async (req, res)=>{
    try {
        const {name, email, password} = req.body;
        if(name === "" || email === "" || password === ""){
            return res.status(400).json({
                message:"Required feiled is should not be empty!",
                success: false
            })
        }
        const passwordRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!^&*+=]).{6,}$/;
        if(!passwordRegx.test(password)){
            return res.status(401).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.",
                success: false
            })
        }
        let admin = await Admin.findOne({email: email});
        if(admin){
            return res.status(402).json({
                message:"User is already exist!!",
                success: false
            })
        }
        const hashpassword = await bcrypt.hash(password, 10)
        admin = await Admin.create({
            name: name,
            email: email,
            password: hashpassword
        })
        return res.status(200).json({
            message: "User Registered successfully!",
            success: false,
            admin
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error in creating the admin!!",
            success: false
        })
    }
}

module.exports.login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(email === "" || password === ""){
            return res.status(400).json({
                message:"Input section should not be empty!",
                success: false
            })
        }
        const admin = await Admin.findOne({email: email});
        if(!admin){
            return res.status(401).json({
                message: "Incorrect Email or password!",
                success: false
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if(!isPasswordCorrect){
            return res.status(402).json({
                message: "Incorrect Email or password!",
                success: false
            })
        }
        const token = jwt.sign(admin.toJSON(), process.env.SECRET_KEY, {expiresIn: "1h"});
        return res.status(200).json({
            message: "You have logged in successfully!",
            success: true,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error in signin the admin!!",
            success: false
        })
    }
}

module.exports.getUser = async (req, res)=>{
    try {
        const user = await Admin.findById(req.user._id);
        if(!user){
            return res.status(400).json({
                message: "user not exist or not available!",
                success: false
            })
        }
        return res.status(200).json({
            message: "here is the user details",
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error in getting the admin details!!",
            success: false
        })
    }
}

module.exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header is missing",
                success: false
            });
        }

        const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'
        if (!token) {
            return res.status(401).json({
                message: "Token is missing in the Authorization header",
                success: false
            });
        }

        await publishToQueue("invalidatedTokens", token); // Invalidate the token
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out", error });
    }
};
