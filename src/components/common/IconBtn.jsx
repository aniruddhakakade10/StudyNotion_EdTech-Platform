import React from "react";
//import Button from "../core/HomePage/Button";

const IconBtn = ({
    text,
    onClick,
    children,
    disabled,
    outline=false,
    customClasses,
    type,
}) => {
    return(
        <button
             disabled={disabled}
            onClick={onClick}
            className={`flex items-center ${
                outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
              } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
            type ={type}
        >
            {
                children ? (
                <>
                <span>
                    {text}
                </span>
                {children}
                </>
                ) : (text )
            }
        </button>
    )
}

export default IconBtn;