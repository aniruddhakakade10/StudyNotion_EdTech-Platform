const express = require("express");
const app = express();

//import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentsRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

//database setup
const database = require("./config/database");
//setting cookie-parser
const cookieParser = require("cookie-parser");
//enable cors
const cors = require("cors");
//connect cloudinary
const {cloudinaryConnect} = require("./config/cloudinary");
//file upload 
const fileUpload = require("express-fileupload")
//env connection
const dotenv = require("dotenv")

dotenv.config();
const PORT = process.env.PORT || 4000

//database connect
database.connect()

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors(
        {
            origin: ["http://localhost:3000"],
            credentials: true,
        }
    ));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
)

//Cloudinary connection
cloudinaryConnect();

//mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentsRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactUsRoute);

//Default route
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the API"
     });
});

//Server start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})