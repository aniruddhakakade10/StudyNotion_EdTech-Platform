import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getPasswordResetToken, resetPassword } from "../services/operations/authAPI";
import { FiEyeOff, FiEye } from "react-icons/fi";

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const location = useLocation;


    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] =useState(false);
    const {loading} = useSelector ((state) => state.auth);

    const {password, confirmPassword} = formData;

    const handleOnChange =(e) => {
       setFormData ((prevData) => {
        return { ...prevData, [e.target.name]: e.target.value }
       })
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password, confirmPassword, token))
    }

    return (
        <div>
            {
                loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <h1>
                            Choose New Password
                        </h1>

                        <p>
                            Almost done. Enter your new password and you are all set.
                        </p>

                        <form  onSubmit={handleOnSubmit}>
                            <label>
                                <p>New Password
                                    <sup>*</sup>
                                </p>
                                <input
                                    required
                                    type= {showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    placeholder="Enter your new password"
                                    onChange={handleOnChange}
                                    className="w-full p-2 bg-richblack-600 text-richblack-5"
                                />
                                <span 
                                onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {
                                        showPassword ? (<FiEyeOff fontSize={24}/>) : (<FiEye fontSize={24}/>)
                                    } 
                                </span>
                            </label>

                            <label>
                                <p> Confirm New Password
                                    <sup>*</sup>
                                </p>
                                <input
                                    required
                                    type= {showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    placeholder="Enter confirm password"
                                    onChange={handleOnChange}
                                    className="w-full p-2 bg-richblack-600 text-richblack-5"
                                />
                                <span 
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {
                                        showPassword ? (<FiEyeOff fontSize={24}/>) : (<FiEye fontSize={24}/>)
                                    } 
                                </span>
                            </label>

                            <button type="submit"> 
                                Reset Password
                            </button>                          
                        </form>

                        <div>
                            <Link to= "/login">
                                    Back to Login
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )

}
export default UpdatePassword;