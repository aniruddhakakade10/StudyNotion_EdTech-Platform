const User = require("../models/User");
const mailSender = require("../utils/mailSender"); 
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
            //Get email from request body
            const email = req.body.email;
            //Check User for the mail or mail validation
            const user = await User.findOne({email: email});
            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "User not found / User is not registered",
                });
            }
            //Generate Token
            const token = crypto.randomBytes(20).toString("hex");
            //Update user by adding expiration time
            const updatedDetails = await User.findOneAndUpdate(
                {email:email},
                {
                    token:token,
                    resetPasswordExpires:Date.now() + 5*60*1000, //5m
                },
                {new:true}
            );
            console.log("Updated Detail: " ,updatedDetails);
            //Create URL    
            const url = `http://localhost:3000/update-password/${token}`

            //Send mamil containing thr Url
            await mailSender(
                            email,
                            "Password Reset Link",
                            `Your Link For Email Verification is: ${url} Please Click this url to reset your password`);    

            
            //return response
            return res.json({
                success: true,
                message: "Password Reset Link has been sent to your email",
            });
        }
            catch(error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Something Went Wrong",
                });
            }
        }

//resetPassword
exports.resetPassword = async (req, res) => {
    try{
        //Fetch data
        const {password, confirmPassword, token} = req.body;
        //Validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }
        //Get user details from using Token
        const userDetails = await User.findOne({token:token});
        //If no entry invalid token return res
        if(!userDetails) {
            return res.json({
                success: false,
                message: "Invalid Token",
            })
        }
        //token time check
        if(!(userDetails.resetPasswordExpires > Date.now()) ){
            return res.status(403).json({
                success: false,
                message: "Password Reset Link has expired",
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update password
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully",
        })
    }   
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Something Went Wrong",
            });
        }
    }
    