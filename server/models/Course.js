const mongoose = require('mongoose');

//Define the Course Schema
const coursesSchema = new mongoose.Schema({
    courseName:{
        type:String,
        trim:true,
    },

    courseDescription:{
        type:String,
        trim:true,
    },

    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true,
    },

    whatYouWillLearn:{
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
        }
    ],

    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],

    price:{
        type: Number,
    },

    thumbnail:{
        type:String,
    },

    tag: {
		type: [String],
		required: true,
	},

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },

    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref: 'user',
        },
    ],

    instructions: {
		type: [String],
	},

	status: {
		type: String,
		enum: ["Draft", "Published"],
	},

},
        { timestamps: true }
);

module.exports = mongoose.model("Course", coursesSchema);