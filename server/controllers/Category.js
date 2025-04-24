const Category = require("../models/Category");
const { Mongoose } = require("mongoose");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

//Create Tag handler functionss
exports.createCategory = async (req, res) => {
    try{
        //fetch data
        const {name, description} = req.body;

        //Validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Please provide name and description"
            });
        }

        //Create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log("Category Details", categoryDetails);

        //return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        });
    }

    catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong"
        });
    }
}

//Get all tags
exports.showAllCategories = async (req, res) => {
    try{
        //fetch data from DB
        // const allCategories = await Category.find({}, {name:true, description:true})
        const allCategories = await Category.find();
        console.log(allCategories);
        return res.status(200).json({
            success:true,
            message: "Tags fetched successfully",
            data: allCategories,
        });
    }

    catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.categoryPageDetails = async (req, res) => {
	try{
		//get category id
		const {categoryId} = req.body;


		//Get courses for specified category id
		const selectedCategory = await Category.findById(categoryId)
                                                .populate({
                                                    path: "courses",
                                                    match: { status: "Published" },
                                                    populate: "ratingAndReviews",
                                                })
                                                .exec()
		//validation
		if(!selectedCategory){
			return res.status(404).json({
				success: false,
				message: "Courses not found",
			});
		}

        // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }

      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })

		//get courses for different categories
		let differentCategories = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
                        .populate({
                            path: "courses",
                            match: { status: "Published" },
                            populate: "ratingAndReviews",
                        })
                        .exec()

        // Get top-selling courses across all categories
 		const allCategories = await Category.find()
                            .populate({
                                path: "courses",
                                match: { status: "Published" },
                            //     populate: {
                            //     path: "instructor",
                            // },
                            populate: [
                                {
                                  path: "instructor", // Populate the instructor field
                                },
                                {
                                  path: "ratingAndReviews", // Populate the ratingAndReviews field
                                  //select: "rating review user", // Select the fields you need from ratingAndReviews
                                },
                              ],
                            })
                            .exec()
 		const allCourses = allCategories.flatMap((category) => category.courses);
 		const mostSellingCourses = allCourses
 			.sort((a, b) => b.sold - a.sold)
 			.slice(0, 10);

		res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategories,
				mostSellingCourses
			},
			message: "Courses displayed successfully",
		});
	}
	catch(error){
		return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          })        
	}
}





















































// exports.categoryPageDetails = async (req, res) => {
// 	try {
// 		const { categoryId } = req.body;

// 		// Get courses for the specified category
// 		const selectedCategory = await Category.findById(categoryId)
// 			.populate("courses")
// 			.exec();
// 		console.log(selectedCategory);
// 		// Handle the case when the category is not found
// 		if (!selectedCategory) {
// 			console.log("Category not found.");
// 			return res
// 				.status(404)
// 				.json({ success: false, message: "Category not found" });
// 		}
// 		// Handle the case when there are no courses
// 		if (selectedCategory.courses.length === 0) {
// 			console.log("No courses found for the selected category.");
// 			return res.status(404).json({
// 				success: false,
// 				message: "No courses found for the selected category.",
// 			});
// 		}

// 		const selectedCourses = selectedCategory.courses;

// 		// Get courses for other categories
// 		const categoriesExceptSelected = await Category.find({
// 			_id: { $ne: categoryId },
// 		}).populate("courses");
// 		let differentCourses = [];
// 		for (const category of categoriesExceptSelected) {
// 			differentCourses.push(...category.courses);
// 		}

// 		// Get top-selling courses across all categories
// 		const allCategories = await Category.find().populate("courses");
// 		const allCourses = allCategories.flatMap((category) => category.courses);
// 		const mostSellingCourses = allCourses
// 			.sort((a, b) => b.sold - a.sold)
// 			.slice(0, 10);

// 		res.status(200).json({
// 			selectedCourses: selectedCourses,
// 			differentCourses: differentCourses,
// 			mostSellingCourses: mostSellingCourses,
// 		});
// 	} catch (error) {
// 		return res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 			error: error.message,
// 		});
// 	}
// };