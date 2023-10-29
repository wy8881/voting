import React, {createContext, useEffect, useState} from 'react';
import api from "../api/axiosConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    async function checkCookie() {
        try {
            const response = await api.get('api/auth/checkCookie');
            const isAuth = response.data;
            if(isAuth === false) {
                localStorage.removeItem('user');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    checkCookie();

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const deleteUser = () => {
        localStorage.removeItem('user');
        setUser(null);
    };



    return (
        <UserContext.Provider value={{ user, setUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};