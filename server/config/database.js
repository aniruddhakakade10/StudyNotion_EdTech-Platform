const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,
    )
    .then( () => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.log("DB connectivity failed");
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });
};