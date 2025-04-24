const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try{
        //extract token from
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        //if token is missing
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        //Verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            //Verification
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This Route is Protected for student"
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , Please try again   " 
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This Route is Protected for Instructor"
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This Route is Protected for Admin"
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}