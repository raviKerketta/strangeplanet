import { useAuthContext } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
import React from "react";


const RequireAuth = ({children}) =>{

    const auth = useAuthContext();
    if(!auth.user){
        return <Navigate to= '/login'></Navigate>
    }

    return children;
}

export default RequireAuth;