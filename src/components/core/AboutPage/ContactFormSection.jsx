import React from "react";
import ContactUsForm from "../../ContactPage/ContactUsForm"

const ContactFormSection = () => {
    return(
        <div className="mx-auto">
            <h1 className="text-center text-4xl font-semibold">Get in Touch</h1>

            <p className="text-center text-richblack-300 mt-3">We'd to love to here from you, Please fill out this form</p>

            <div className="mt-12 mx-auto">
                <ContactUsForm/>
            </div>
        </div>
    )
}

export default ContactFormSection;