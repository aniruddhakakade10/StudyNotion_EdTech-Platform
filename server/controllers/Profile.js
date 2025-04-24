const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose")
const {convertSecondsToDuration} = require("../utils/secToDuration")


   
exports.updateProfile = async(req, res) => {
   // try{
    //     //Get Data
    //     const {dateOfBirth= "", about= "", contactNumber} = req.body; 
    //     //Get User ID
    //     const id = req.user.id;
        
    //     //Find Profile
    //     const userDetails = await User.findById(id);
    //     // const profileId = userDetails.additionalDetails;
    //     // const profileDetails = await Profile.findById(profileId);
    //     const profile = await Profile.findById(userDetails.additionalDetails);

    //     //Update Profile
    //     profile.dateOfBirth = dateOfBirth;
    //     profile.about = about;
    //     profile.contactNumber = contactNumber;
    //     //Save Profile
    //     await profile.save();
        
    //     //Return Response
    //     return res.status(200).json({
    //         success: true,
    //         message: "Profile Updated Successfully",
    //         profile,
    //     });
    // }
    try{
         const {
             firstName = "",
             lastName = "",
             dateOfBirth= "",
             about= "",
             contactNumber= "",
             gender= "",
         } = req.body;

         const id = req.user.id

         //Find the details by profile ID
         const userDetails = await User.findById(id)
         const profile = await Profile.findById(userDetails.additionalDetails)

         const user = await User.findByIdAndUpdate(id,{
            firstName,
            lastName,
         })

         await user.save();

         // Update the profile fields
          profile.dateOfBirth = dateOfBirth
          profile.about = about
          profile.contactNumber = contactNumber
          profile.gender = gender

          // Save the updated profile
          await profile.save()

          // Find the updated user details
          const updatedUserDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec()

          return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Couldn't Update Profile"
        })
    }
}

//Delete Profile
exports.deleteAccount = async (req, res) => {
    try{
        // TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
        //Get Id Of Profile
        const id = req.user.id;
        //Validation
        const user = await User.findById({_id: id});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }
        //Delete Profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails});
        //TODO: Remove User From All Enrolled Courses
        //Delete User
        await User.findByIdAndDelete({_id:id});
        //Return Response
        return res.status(200).json({
            success: true,
            message: "Profile Deleted Successfully"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Couldn't Delete Profile"
        });
    }
}

//Get All User Details Handler
exports.getAllUserDetails = async (req, res) => {
    try{
        //Get Id
        const id = req.user.id;

        //Validation and Get User Details
        const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();
        console.log(userDetails);
         if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
    }
        //Return Response
        return res.status(200).json({
            success: true,
            message: "User Details Retrieved Successfully",
            data: userDetails,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Couldn't Get User Details",
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        // .populate("courses")
        // .exec()
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
         .exec();

         userDetails = userDetails.toObject()
         var SubsectionLength = 0
         for (var i = 0; i < userDetails.courses.length; i++) {
           let totalDurationInSeconds = 0
           SubsectionLength = 0
           for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
             totalDurationInSeconds += userDetails.courses[i].courseContent[
               j
             ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
             userDetails.courses[i].totalDuration = convertSecondsToDuration(
               totalDurationInSeconds
             )
             SubsectionLength +=
               userDetails.courses[i].courseContent[j].subSection.length
           }
           let courseProgressCount = await CourseProgress.findOne({
             courseID: userDetails.courses[i]._id,
             userId: userId,
           })
           courseProgressCount = courseProgressCount?.completedVideos.length
           if (SubsectionLength === 0) {
             userDetails.courses[i].progressPercentage = 100
           } else {
             // To make it up to 2 decimal point
             const multiplier = Math.pow(10, 2)
             userDetails.courses[i].progressPercentage =
               Math.round(
                 (courseProgressCount / SubsectionLength) * 100 * multiplier
               ) / multiplier
           }
         }

      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard = async (req, res) => {
    try{
       const courseDetails  = await Course.find({
            instructor: req.user.id
       });

       const courseData = courseDetails.map((course) => {
          const totalStudentsEnrolled = course.studentsEnrolled.length
          const totalAmountGenerated = totalStudentsEnrolled * course.price

          //crete a new object with the required data
          const courseDataWithStats = {
            _id: course._id,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            totalStudentsEnrolled,
            totalAmountGenerated,
          }
          return courseDataWithStats
       })
         res.status(200).json({
            courses: courseData,
         })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message
        })
    }
}