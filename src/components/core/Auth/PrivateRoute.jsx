import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// const PrivateRoute = ({isLoggedIn, children}) => {
//     // if (!isLoggedIn) {
//     //     return <Redirect to="/login" />
//     // }
//     ;
//     if(isLoggedIn){
//         return children;
        
//     }
//     else{
//        return  <Navigate to ="/login"/>
//     }
// }

const PrivateRoute = ({ children }) => { 
   
    const {token} = useSelector((state) => state.auth)

    if(token !== null){
        return children;
    }
    else{
        return <Navigate to = "/login"/>
    }
}

export default PrivateRoute;