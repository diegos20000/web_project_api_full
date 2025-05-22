import React, { createContext, useState, useEffect } from "react";
import Api from '../utils/api';

const CurrentUserContext = createContext();

const CurrentUserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({
        name: '',
        avatar: '',
        about: '',
        _id: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try{
                const userData = await Api.getUserInfo();
                
                
                setCurrentUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            {children}
        </CurrentUserContext.Provider>
    );


};

export {CurrentUserContext, CurrentUserProvider};
