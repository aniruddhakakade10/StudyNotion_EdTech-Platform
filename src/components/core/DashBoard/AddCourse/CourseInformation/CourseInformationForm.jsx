import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { useDispatch, useSelector } from "react-redux";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { setStep, setCourse} from '../../../../../slices/courseSlice';
import RequirementField from "./RequirementField";
import { COURSE_STATUS } from '../../../../../utils/constants';
import toast from "react-hot-toast";
import ChipInput from "./ChipInput";
import Upload from "../Upload";
import { MdNavigateNext } from "react-icons/md";

const CourseInformationForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const {token} = useSelector((state) =>state.auth);
    const {course, editCourse} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            //console.log("All Course categories: ",categories);
            if(categories?.length > 0) {
                setCourseCategories(categories);
            }
            setLoading(false);
        }

        if(editCourse){
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
        getCategories();
    },[])

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail              
        )
        {
            return true;
        }
            return false;
    }
 
        //Handles 
    const onSubmit = async(data) => {
        if(editCourse){
           if(isFormUpdated()){
            const currentValues = getValues();
            const formData = new FormData();

            formData.append("courseId", course._id);
            if(currentValues.courseTitle !== course.courseName){
                formData.append("courseName", data.courseTitle);
            }

            if(currentValues.courseShortDesc !== course.courseDescription){
                formData.append("courseDescription", data.courseShortDesc);
            }

            if(currentValues.coursePrice !== course.price){
                formData.append("price", data.coursePrice);
            }

            if (currentValues.courseTags.toString() !== course.tag.toString()) {
                formData.append("tag", JSON.stringify(data.courseTags))
            }

            if(currentValues.courseBenefits !== course.whatYouWillLearn){
                formData.append("whatYouWillLearn", data.courseBenefits);
            }

            if(currentValues.courseCategory._id !== course.category._id){
                formData.append("category", data.courseCategory);
            }

            if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
                formData.append("instructions", JSON.stringify(data.courseRequirements));
            }

            if (currentValues.courseImage !== course.thumbnail) {
                formData.append("thumbnailImage", data.courseImage)
              }

            setLoading(true);
            const result = await editCourseDetails(formData, token);
            setLoading(false);
            if(result){
                dispatch(setStep(2));
                dispatch(setCourse(result));
            }
           }
            else{
                toast.error("No changes made to the form");
            }
            return;
        }

        //Create a new Course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn",data.courseBenefits)
        formData.append("category",data.courseCategory)
        formData.append("instructions",JSON.stringify(data.courseRequirements));
        formData.append("thumbnailImage", data.courseImage)
        formData.append("status", COURSE_STATUS.DRAFT)

        setLoading(true);
        const result = await addCourseDetails(formData,token);
        if(result) {
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
        
    }

    return(
        <>
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-md border-[1px] border-richblack-700 text-richblack-700 bg-richblack-800 p-6 space-y-8"
        >
            {/* Course Title */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                    Course Title <sup className="text-pink-200">*</sup>
                </label>
                <input
                    id="courseTitle"
                    placeholder="Enter Course Title"
                    {...register("courseTitle", {required: true})}
                    className="form-style w-full"
                />
                {
                    errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is mandatory <sup className="text-pink-200">* </sup></span>
                )
                }
            </div>

                {/* Course Short Description */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">Course Short Description <sup className="text-pink-200">*</sup></label>
                 <textarea
                    id="courseShortDesc"
                    placeholder="Enter Description...."
                    {...register("courseShortDesc", {required: true})}
                    className="form-style resize-x-none min-h-[130px] w-full"
                 />
                 {
                    errors.courseShortDesc && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is required</span>
                    )
                 }
            </div>

                 {/* Course Prices */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="coursePrice">Course Price <sup className="text-pink-200">*</sup></label>
              <div className="relative">
              <input
                    id="coursePrice"
                    placeholder="Enter course Price"
                    {...register("coursePrice", {required: true , valueAsNumber:true, 
                        pattern: {
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                          },
                    })}
                    className="form-style w-full !pl-12"
                />
                <HiOutlineCurrencyRupee
                    className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400"
                />
              </div>
                {
                    errors.coursePrice && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is required</span>
                    )
                }
            </div>

                {/* Course Category */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseCategory">Course Category <sup className="text-pink-200">*</sup></label>
                <select
                    {...register("courseCategory", {required: true})}
                    id="courseCategory"
                    defaultValue=""
                    className="form-style w-full"
                >
                    <option value="" disabled>Choose a category</option>
                    {
                        !loading && courseCategories.map((category, index) => (
                             <option key={index} value={category?._id}>
                                {category?.name}
                            </option>
                        ))
                    }
                </select>
                {
                     errors.courseCategory && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is required</span>
                     )
                }
            </div>

                {/* Course Tags */}
            {/* Create a custom component to handle the tags inputs */}
            <ChipInput
                label="Tags"
                name="courseTags"
                placeholder="Enter tags and press enter"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />

            {/* Course Thumbnail Image */}
            {/* Create a component for ploading and showing preview of media */}
             <Upload
            name= "courseImage"
            label= "Course Thumbnail"
            register={register}
            errors= {errors}
            setValue={setValue}
            editData={editCourse ? course?.thumbnail: null}
            />

            {/* Benefits of the course */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5"
                htmlFor="courseBenefits"
                >
                    Benefits of the course
                    <sup className="text-pink-200">*</sup>
                </label>
                <textarea
                    id="courseBenefits"
                    placeholder="Enter the benefits of the course"
                    {...register("courseBenefits", {required: true})}
                    className="form-style resize-x-none min-h-[130px] w-full"
                />
                {errors.courseBenefits && (<span className="ml-2 text-xs tracking-wide text-pink-200">Course Benefits is required</span>)} 
            </div>

            <RequirementField
                name="courseRequirements"
                label="Requirements"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />
            
            {/* Next Button */}
            <div className="flex justify-end gap-x-2">
                {
                    editCourse && (
                        <button
                            onClick={() => dispatch(setStep(2))}
                            disabled={loading}
                            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                        >
                            Continue Without Saving
                        </button>
                    )
                }
                <IconBtn
                    disabled={loading}
                    text={!editCourse ? "Next": "Save Changes"}
                >
                <MdNavigateNext/>
                </IconBtn>
            </div>
        </form>
    </>
    )
}
export default CourseInformationForm;