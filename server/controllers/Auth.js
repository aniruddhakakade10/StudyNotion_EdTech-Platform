const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile")
require("dotenv").config();


//SignUp Page
exports.signup = async(req,res) => {
    try{
        //Data fetch from request bodyy
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        //Validate the data
        if(!firstName || !lastName, !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "Please fill the required fields",
            });
        }

        //Password match checking.......
        if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password does not match",
            });
        }

        //Check whether user already exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        //find the most recent OTP
        const response = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(response);
        //Validate OTP
        if(response.length === 0) {
            //OTP not found for the account
            return res.status(400).json({
                success: false,
                message: "OTP Not Found Properly",
            });
        } else if (otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        //Create entry in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about: null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User Cannot be registered, Please try again",
        });
    }
};


//Login Page
exports.login = async (req, res) => {
    try{
        //get request from request.body
        const {email, password} = req.body;

        //Validation
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter both email and password",
            });
        }
        //User exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message: "User is not registered, Please SignUp to continue",
            });
        }

        //Generate JWT, after password match
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(isValidPassword){
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            //save token to user document in user database
            user.token = token;
            user.password = undefined;

            //Create cookie
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Login Successfull",
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
             });
            }
       }
        catch(error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Failed to login, Please try again",
            })
      }
};

//Send OTP for email Verification
exports.sendotp = async (req,res) => {
    try{
        //step1 fetch mail from request body
    const { email } = req.body;

    //step2 check if user already exists
    const checkUserPresent = await User.findOne({ email });

    //if user already exists then,
    if(checkUserPresent) {
        return res.status(401).json({
            success: false,
            message: "User already exists",
        }); 
    }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            digits:true
        });
        console.log("OTP Generated", otp);

        //Check if otp is unique or not
        const result = await OTP.findOne({ otp: otp });
        console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);

        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
                digits:true
        });
             
    }
        const otpPayload = {email, otp};

        //Create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body:",otpBody);

        //return response of succesfull OTP creation
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });
    } 
    catch(error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// //Change Password
// exports.changePassword = async (req, res) => {
//     //Get data from req body
//     //const {oldPassword, newPassword, confirmNewPassword} = req.body;
//     //Validation on passwords
    
//     //update password in the dbs
//     //Send mail of pass update
//     //return response

// }

// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
}; 