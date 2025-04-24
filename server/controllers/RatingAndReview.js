const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { mongo, default: mongoose } = require("mongoose");


//Creaate a new rating and review
exports.createRating = async (req, res) => {
    try{

        //get user Id
        const userId = req.user.id;
        //fetch data
        const {rating, review, courseId} = req.body;

        //Check whether user enrolled course or not
        const courseDetails = await Course.findOne(
                                        {_id:courseId,
                                            studentsEnrolled: {$elemMatch: {$eq: userId}},
                                        });

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "You are not enrolled in this course", 
            });
        }
        //Check whether user already given review
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });
        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "Course alredy reviewed by user",
            })
        }
        //create new rating and review
        const ratingReview = await RatingAndReview.create({
                                                rating, 
                                                review,
                                                course:courseId,
                                                user:userId
        });
        
        //Update the couse with rating
       const updatedCourseDetails =  await Course.findByIdAndUpdate( {_id: courseId},
                                        {
                                            $push: {
                                                ratingAndReviews: ratingReview._id,
                                            }
                                        },
                                        {new: true}
            ///{$inc: {rating: rating}},{new: true},function(err, course)
         );
         console.log(updatedCourseDetails);
        //Return response
        return res.status(200).json({
            success: true,
            message: "Rating and review added successfully",
            ratingReview,
        });
    }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Couldn't Added Reviews",
            })
        }
    }


//Create Average Rating
exports.getAverageRating = async (req, res) => {
    try{
        //get course id
        const courseId = req.body.courseId;

        //Calculate avg ratingg
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ])

        //Return response rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }


        //if no rating and review
        return res.status(200).json({
            success: true,
            message: "No Rating and Review",
            averageRating: 0
        })
    }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "error.message",
            })
    }
}

//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                                    .sort({rating: "desc"})
                                                    .populate({
                                                        path: "user",
                                                        select: "firstName lastName email image",
                                                    })
                                                    .populate({
                                                        path: "course",
                                                        select: "courseName",
                                                    })
                                                    .exec();
            
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "error.message",
            });
    }
}

