const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {default: mongoose} = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");


//init the razorpay server
exports.capturePayment = async(req, res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0){
        return res.json({
            success: false,
            message: "No courses selected"
        });
    }

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        //console.log(course_id);
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(200).json({
                    success: false,
                    message: "Course not found"
                });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "You have already enrolled in this course"
                });
            }
            totalAmount += course.price;
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            })  
        }
    }
    //Order creation
    const currency = "INR"
    const options  = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }
    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: paymentResponse,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        }) 
    }
}

//Verify payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id || 
        !razorpay_payment_id || 
        !razorpay_signature || !courses || !userId){
        return res.status(200).json({
            success: false,
            message: "Invalid request, Payment Failed",
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');

    if(expectedSignature === razorpay_signature){
        //Enroll Student into the Course
        await enrollStudents(courses, userId, res);
        //return res
        return res.status(200).json({
            success: true,
            message: "Payment Verified",
        })
    }

        return res.status(200).json({
            success: false,
            message: "Payment Failed",
        })
}

    const enrollStudents = async(courses, userId, res) => {
        if(!courses || !userId){
            return res.status(400).json({
                success: false,
                message: "Invalid request, Enroll Failed",
            })
        }

        for(const courseId of courses){
           try{
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                {$push:{studentsEnrolled:userId}},
                {new: true},
               )
    
               if(!enrolledCourse){
                   return res.status(500).json({
                    success: false,
                    message: "Enroll Failed",
                })
               }

               const courseProgress = await CourseProgress.create({
                    courseID: courseId,
                    userId: userId,
                    completedVideos: []
               })
    
               //Find the student and add the course to their list of enrolled Courses
               const enrolledStudent = await User.findByIdAndUpdate(userId,
                {$push:{
                    courses: courseId,
                    courseProgress: courseProgress._id
                }},
                {new: true})
    
               //Mail Send to the student
               const emailResponse = await mailSender(
                //   enrollStudents.email,
                    enrolledStudent.email,
                  `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
               )
               //console.log("Email Sent Succesfull", emailResponse.response);
           }            
            catch(error){
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Enroll Failed",
                })
            }  
        }
    }

    exports.sendPaymentSuccessEmail = async(req, res) => {
        const {orderId, paymentId, amount} = req.body;

        const userId = req.user.id;

        if(!orderId || !paymentId || !amount || !userId){
            return res.status(400).json({
                success: false,
                message: "Please fill require fields",
            })
        }

        try{
            //Find the user
            const enrolledStudent = await User.findById(userId);
            await mailSender(
                enrolledStudent.email,
                `Payment Received`,
                paymentSuccessEmail(`${enrolledStudent.firstName}`, amount/100, orderId, paymentId) 
            )
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Couldn't Send Emails",
            });
        }
    }


//---------------------------------------------------------------------------------------------------------------------------------------