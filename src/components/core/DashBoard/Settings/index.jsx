import React from "react";
import ChangeProfilePicture from "./ChangeProfilePicture";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";

export default function Settings() {
    return (
        <>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                Edit Profile
            </h1>
            {/* Section-i (CHANGE PROFILE PICTURE) */}
            <ChangeProfilePicture/>
            {/* Section-ii (PROFILE INFORMATION ) */}
            <EditProfile/>
            {/* Section-iii (UPDATE PASS) */}
            <UpdatePassword/>
            {/* Section -iv (DELETE ACCOUNT)*/}
            <DeleteAccount/>
        </>
    )
}