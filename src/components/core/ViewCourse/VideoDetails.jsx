import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {Player} from 'video-react';
import {markLectureAsComplete} from "../../../services/operations/courseDetailsAPI";
import 'video-react/dist/video-react.css';
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { IoMdPlay } from "react-icons/io";
import IconBtn from "../../common/IconBtn"
const VideoDetails = () => {

    const {courseId, sectionId, subSectionId} = useParams();    
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const playerRef = useRef();
    const {token} = useSelector((state) => state.auth)
    const {courseSectionData, courseEntireData, completedLectures} = useSelector((state) => state.viewCourse);

    const [videoData, setVideoData] = useState([])
    const [previewSource, setPreviewSource] = useState("")
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const  setVideoSpecificDetails = async () => {
            if(!courseSectionData.length)
                return;
            if(!courseId && !sectionId && ! subSectionId){
                navigate("/dashboard/enrolled-courses");
            }
            else{
                //lets assume all three fiels are presesnt
                const filteredData = courseSectionData.filter(
                    (course) => course._id === sectionId
                )
                const filteredVideoData = filteredData?.[0].subSection.filter(
                    (data) => data._id === subSectionId
                )

                setVideoData(filteredVideoData[0]);
                setPreviewSource(courseEntireData.thumbnail)
                setVideoEnded(false);
            }
        }
        setVideoSpecificDetails();
    }, [courseSectionData, courseEntireData, location.pathname])

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )
        if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
            return true;
        }
        else{
            return false;
        }
    }

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )

        if(currentSectionIndex === courseSectionData.length - 1 && 
            currentSubSectionIndex === noOfSubSections - 1) {
                return true;
            }
        else{
            return false;
        }
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )

        if(currentSubSectionIndex !== noOfSubSections - 1){
            //move to next video of same section
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id;
            //move to the video
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }
        else{
            //Different section first video
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
            //move to the video
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPreviousVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )

        if(currentSubSectionIndex !== 0){
            //move to previous video of same section
            const previousSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1];
            //move to the video
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSectionId}`)
        }
        else{
            //different section last video
            const previousSectionId = courseSectionData[currentSectionIndex - 1]._id
            const previousSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
            const previousSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[previousSubSectionLength - 1]._id;

            //move to the video
            navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`) 
        }
    }

    const handleLectureCompletion = async () => {
        setLoading(true);

        const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);

        if(res){
            dispatch(updateCompletedLectures(subSectionId));
        }

        setLoading(false);
    }

    return (
        <div className="flex flex-col gap-5 text-white">
            {
                !videoData ? (
                // <div>
                //     No Data Found
                // </div>
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
                ) :
                (
                    <Player
                        ref = {playerRef}
                        aspectRatio="16:9"
                        playsInLine
                        onEnded={() => setVideoEnded(true)}
                        src={videoData?.videoUrl}
                    >
                        <IoMdPlay position="center" />
                        {
                            videoEnded && (
                                <div
                                style={{
                                    backgroundImage:
                                      "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                                  }}
                                  className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"                    
                                >
                                    {
                                        !completedLectures.includes(subSectionId) && (
                                            <IconBtn
                                                disabled={loading}
                                                onClick={() => handleLectureCompletion()}
                                                text={!loading ? "Mark As Completed" : "Loading..."}
                                                customClasses="text-lg max-w-max px-4 mx-auto"
                                            />
                                        )
                                    }
                                            <IconBtn
                                                disabled={loading}
                                                onClick={() => {
                                                    if(playerRef?.current){
                                                        playerRef?.current.seek(0);
                                                        setVideoEnded(false);
                                                    }
                                                }}
                                                text="Rewatch"
                                                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                                            />

                                            <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                                {!isFirstVideo() && (
                                                    <button
                                                        disabled={loading}
                                                        onClick={goToPreviousVideo}
                                                        className="blackButton"
                                                    >
                                                        Previous
                                                    </button>
                                                )}

                                                {!isLastVideo() && (
                                                    <button
                                                        disabled={loading}
                                                        onClick={goToNextVideo}
                                                        className="blackButton"
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                            </div>
                                         </div>
                                        )}
                                </Player>
                            )}

                    <h1>
                        {videoData?.title}
                    </h1>
                    <p>
                        {videoData?.description}
                    </p>
            </div>
        )
    }

export default VideoDetails;