import React, { createContext, useContext, useState } from "react";

const authContext = createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = user => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <authContext.Provider value= {{user, login, logout}}>
            {children}
        </authContext.Provider>
    )
}

const useAuthContext = () => {
    return useContext(authContext);
}

export {AuthProvider, useAuthContext};