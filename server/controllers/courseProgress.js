const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection")


exports.updateCourseProgress = async (req,res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;

    try{
        //Check whether the video is valid or not
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({message: "Invalid subSection"});
        }
            console.log("SubSection validation done");
        //Check an old entry
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course Progress not found",
            });
        }
        else{
            console.log("Course Progress validation done");
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    success: false,
                    message: "Video already completed",
                })
            }

            //push to completed video
            courseProgress.completedVideos.push(subSectionId);
            console.log("Course Progress update done");
        }
        await courseProgress.save();
        console.log("Course progress save done");
        res.status(200).json({
            success: true,
            message: "Course Progress updated successfully",
        });
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}