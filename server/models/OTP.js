const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerificationTemplate");


const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },

    otp:{
        type:String,
        required:true,
        },

    createdAt:{
        type:Date,
        default:Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    },
});

// function for otp mail send
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email from studynotion", emailTemplate(otp));
        console.log("Email Sent Successfully", mailResponse);


    } catch(error){
        console.log("Error occured while sending the mail",error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next) {
    console.log("New document saved to database");

    //Only to Send the email when new doc is created
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);