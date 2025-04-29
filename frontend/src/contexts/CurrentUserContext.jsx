import React, { createContext, useState, useEffect } from "react";
import apiInstance from "../utils/api";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await apiInstance.getUserInfo();
                setCurrentUser(userInfo);
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);  
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <CurrentUserContext.Provider value={currentUser}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export default CurrentUserContext;
