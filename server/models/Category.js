const mongoose = require('mongoose');

//Define Categoryschema
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        trim:true,
    },

    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]

});

module.exports = mongoose.model("Category", categorySchema);