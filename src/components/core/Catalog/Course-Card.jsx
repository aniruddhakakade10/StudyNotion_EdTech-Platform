import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../common/RatingStars"
import GetAvgRating from "../../../utils/avgRating"
import ReactStars from "react-stars";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const Course_Card = ({course, Height}) => {

    const [avgReviewCount, setAvgRatingCount] = useState(0);

    useEffect(() => {
        if (course?.ratingAndReviews?.length) {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgRatingCount(count);
        console.log(count);
    }
        
    }, [course]);


    return (
        <>
            <Link to={`/courses/${course._id}`}>
              <div>
                <div className="rounded-lg">
                    <img 
                        src={course?.thumbnail}
                        alt="courseimage"
                        className={`${Height} w-full rounded-xl object-cover`}
                    />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">{course?.courseName}</p>
                    <p className="text-sm text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">{avgReviewCount || 0}</span>
                                        {/* { <ReactStars
                                                count={5}
                                                value={avgReviewCount || 0}
                                                size={20}
                                                edit={false}
                                                activeColor="#ffd700"
                                                emptyIcon={<FaRegStar />}
                                                fullIcon={<FaStar />}
                                        />} */}
                        <RatingStars Review_Count={avgReviewCount}/>
                        <span className="text-richblack-400">{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
                </div>
            </div>
        </Link>
     </>
    )
}

export default Course_Card;