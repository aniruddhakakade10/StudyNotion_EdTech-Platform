const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
// const Category = require("../models/Category");

exports.createSection = async (req, res) => {
    try{
        //Data Fetch
        const {sectionName, courseId} = req.body;
        //Validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }
        //Create Section
        const newSection = await Section.create({ sectionName })
        //Update Course With Section Object Id
        const updatedCourse = await Course.findByIdAndUpdate(
                                            courseId,
                                                {
                                                    $push:{
                                                        courseContent: newSection._id
                                                    },
                                                },
                                                        {new: true},
                                            )
        //Use Populate function to replace sections/sub-sections both in the updatedCourseDetails
                                                .populate({
                                                    path: "courseContent",
                                                    populate: {
                                                        path: "subSection",
                                                    },
                                                })
                                                .exec();

        //const updatedCourseDetailsWithSections = await updatedCourseDetails.populate('courseContent').exec();
        //Return Response
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            //data: updatedCourse,
            updatedCourse,
        });
    }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Failed to Create Section",
                error: error.message,   
            });
        }
    };


//Update Section
exports.updateSection = async (req, res) => {
    try{
        //Data Input
        const {sectionName, sectionId, courseId} = req.body;
        //Validation
         if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            });
         }
        //Update The Data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true})

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate:{
                path: "subSection",
            },
        })
        .exec();


        //Return Response
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            data: course,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Update Section"
        });
    }
}

//Delete Section HAndler

exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
    }
    catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		})
    }
}