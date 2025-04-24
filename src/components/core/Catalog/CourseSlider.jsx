import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/free-mode";
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Navigation, Pagination}  from 'swiper/modules';
import Course_Card from "./Course-Card";

const CourseSlider = ({Courses}) => {
    return (
       <>
            {
                Courses?.length ? (
                    <Swiper
                        slidesPerView={3}
                        loop={true}
                        spaceBetween={25}
                        modules={[Autoplay,Pagination,Navigation]}
                        //modules={[FreeMode, Pagination]}
                        //  
                        autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        }}
                        navigation={true}
                        // breakpoints={{
                        //     1024:{slidesPerView:3,},
                        // }}
                        className="max-h-[30rem]"
                    >
                        {
                            Courses.map((course, index) => (
                                <SwiperSlide key={index}>
                                    <Course_Card course = {course} Height={"h-[250px]"}/>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                ) : (
                    <p className="text-xl text-richblack-5">No Courses Found</p>
                )
            }
       </>
    )
}

export default CourseSlider;