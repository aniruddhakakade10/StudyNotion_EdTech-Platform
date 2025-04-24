const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
// const Category = require("../models/Category")
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//Create SubSection
exports.createSubSection = async (req, res) => {
    try{
        //Data Fetch
        const { sectionId, title, description } = req.body;
        //Extract File Video
        const video = req.files.video;
        //Validation
        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        console.log(video);
        //Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        console.log(uploadDetails);
        //Create A SubSection
        const SubSectionDetails = await SubSection.create({
            title:title,
            //timeDuration:timeDuration,
            timeDuration: `${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //Update Section With This SubSectionId
        const updatedSection = await Section.findByIdAndUpdate(
                                            {_id: sectionId},
                                            {$push: {
                                                subSection: SubSectionDetails._id
                                            }},
                                            {new: true}
                                        ).populate("subSection");
                                        console.log(updatedSection);
    //Populate the section
    //const populatedSection = await Section.findById(sectionId).populate('subSections')
        //Return Response
        return res.status(200).json({
            success: true,
            data: updatedSection,
            message: "SubSection Created Successfully",
        })
        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong",
            error: error.message,
        });
    }
};

//Update SUBSECTION
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data: updatedSection, 
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  
  //DELETE SUBSECTION
  exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data: updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }