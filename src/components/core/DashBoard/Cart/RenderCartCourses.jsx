import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosStarHalf } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { removeFromCart } from "../../../../slices/cartSlice";
import ReactStars from "react-stars"
import GetAvgRating from "../../../../utils/avgRating";

const RenderCartCourses = () => {

    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();


    return (
        <div className="flex flex-1 flex-col">
            {
                cart.map((course, index) => {
                  return  <div  key={course._id}
                    className={`flex w-full flex-wrap items-start justify-between gap-6 ${
                        index !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
                      } ${index !== 0 && "mt-6"}`}
                    >
                        <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                            <img src={course?.thumbnail} alt="thumbnails" className="h-[148px] w-[220px] rounded-lg object-cover"/>
                             <div className="flex flex-col space-y-1">
                                <p className="text-lg font-medium text-richblack-5">{course?.courseName}</p>
                                <p className="text-sm text-richblack-300">{course?.category?.name}</p>
                                <div className="flex items-center gap-2">
                                    {/* Connect API of get AverageRating */}
                                    <span className="text-yellow-5">{GetAvgRating}</span>
                                    <ReactStars
                                        count = {5}
                                        size = {20}
                                        edit = {false}
                                        activeColor="#ffd700"
                                        emptyIcon={IoIosStarOutline}
                                        fullIcon={IoIosStar}
                                        halfIcon={IoIosStarHalf}                       
                                    />
                                    <span className="text-richblack-400">{course?.ratingAndReviews?.length} Ratings </span>

                                </div>
                             </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2"
                        >
                            <button
                            onClick={() => dispatch(removeFromCart(course._id))}
                            className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
                            >
                                <MdDeleteForever/>
                                <span>Remove</span>
                            </button>
                           <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {course?.price} </p>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default RenderCartCourses;