import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CoursesTable from "./InstructorCourses/CoursesTable";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import { GoPlus } from "react-icons/go";
import IconBtn from "../../common/IconBtn";

const MyCourses = () => {

    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const result = await fetchInstructorCourses(token);
            if(result){ 
                setCourses(result);
            }
        }
        fetchCourses();
    }, [])
    return(
        <div>
            <div className="mb-14 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
                <IconBtn
                    text="Add Course"
                    onClick={() => navigate("/dashboard/add-course")}
                >
                <GoPlus />
                </IconBtn>
            </div>

            {
                courses && <CoursesTable courses={courses} setCourses = {setCourses} />
            }
        </div>
    )
}

export default MyCourses;