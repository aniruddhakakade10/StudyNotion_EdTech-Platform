import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {apiConnector} from "../../services/apiconnector"
import CountryCode from "../../data/countrycode.json"
import { contactusEndpoint } from "../../services/apis"

const ContactUsForm = () => {

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm();

    const submitContactForm = async (data) => {
        try{
            setLoading(true);
            //const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            // const response = {status: "OK"}
            // console.log("Logging response", response);
            //console.log(data);
            const res = await apiConnector("POST", contactusEndpoint.CONTACT_US_API,
            data
            )
            setLoading(false);
        }
        catch(error){
            console.log("Error", error);
            setLoading(false);
        }
    }

    useEffect ( () => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: "",
            });
        }
    }, [reset, isSubmitSuccessful])

    return (
        <form 
        className="flex flex-col gap-7"
        onSubmit={handleSubmit(submitContactForm)}>
        <div className="flex flex-col gap-5 lg:flex-row">

                 {/* FirstName */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstName" className="lable-style">First Name:  </label>
                    <input 
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="Enter First Name"
                    className="form-style"
                    {...register("firstname", { required: true })} 
                    />
                    {errors.firstname && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            This field is required
                        </span>)}
            </div>

               {/* LastName */}
               <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastname" className="lable-style">Last Name:  </label>
                    <input 
                    type="text"
                    name="lastname"
                    id="lastname"
                    className="form-style"
                    placeholder="Enter last Name"
                    {...register("lastname")} 
                    />
                </div>
            </div>

                {/* email */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="lable-style">Email Address: </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                        className="form-style"
                        {...register("email", { required: true })}
                    />
                    {errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            This field is required
                        </span>)}
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="phonenumber" className="lable-style">Phone Number: </label>
                    <div className="flex gap-5">
                        {/* Dropdown */}
                        <div className="flex w-[81px] flex-col gap-2">
                            <select 
                                name="dropdown"
                                id="dropdown"
                                className="form-style"
                                {...register("country-code", { required: true })}
                            >
                                {
                                    CountryCode.map((element, index) => {
                                        return (
                                            <option key={index} value={element.code}>
                                                {element.code} - {element.country}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                            <input
                                type="number"
                                name="phonenumber"
                                id="phonenumber"
                                placeholder="12345-67890"
                                className="form-style"
                                {...register("phoneNo", { required: true, message:"Please add contact number" }, { maxLength: 10, message: "Invalid mobile number" })}
                            />
                        </div>
                    </div>
                    {
                        errors.phoneNo && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            {errors.phoneNo.message}
                        </span>)
                    }
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="message">Enter Message: </label>
                    <textarea
                        name="message"
                        id="message"
                        cols="30"
                        rows="7"
                        placeholder="Enter your message here"
                        className="form-style"
                        {...register("message", { required: true })}
                    />
                    {errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your message
                        </span>)}
                </div>

                <button type="submit" disabled={loading}
                className={`rounded-md bg-yellow-50 text-center px-6 py-3 text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
                 ${ !loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"} disabled:bg-richblack-500 sm:text-[16px] `}
                >
                    Send message
                </button>
            
        </form>
    )
}

export default ContactUsForm;