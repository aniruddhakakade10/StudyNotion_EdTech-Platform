import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "../HomePage/HighlightText"
import CourseCard from "../HomePage/CourseCard";
const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        console.log(result);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }


    return (
        <div>
            <div className="font-semibold text-4xl text-center my-8 mx-auto">
                Unlock the
                <HighlightText text={" Power of Code"}/>
            </div>

            <p className="text-center text-richblack-300 text-lg font-semibold mt-3">
                Learn to build anything you can imagine
            </p>

            <div className="flex flex-row rounded-full bg-richblack-800 mb-5 mt-5 p-1 gap-1">
                {
                    tabsName.map((element, index) => {
                        return (
                            <div
                            className={`text-[16px] flex flex-row items-center gap-2
                                ${currentTab === element
                                     ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200"}
                                       rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-[7px]` }
                                      key={index}
                                      onClick={() => setMyCards(element)}
                            >
                                {element}
                            </div>
                        );
                    })
                }
            </div>

            <div className=" hidden lg:h-[150px] lg:block "></div>
                {/* Course Card*/}
                <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap  w-full lg:bottom-[0] lg:left-[50%] 
                lg:translate-x-[-50%] lg:translate-y-[50%] 
                text-black lg:mb-0 mb-7 lg:px-0 px-3">
                    {
                        courses.map( (element, index) => {
                            return (
                                <CourseCard
                                key={index}
                                cardData={element}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}
                                />
                            );
                        })
                    }
                </div>            
          </div>
    );
};

export default ExploreMore;