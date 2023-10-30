import React, {createContext, useEffect, useState} from 'react';
import api from "../api/axiosConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    console.log("user context amount")

    async function checkCookie() {
        try {
            const response = await api.get('api/auth/checkCookie');
            const isAuth = response.data;
            if (isAuth === false) {
                console.log("not auth")
                deleteUser();
            }
        } catch (error) {
            console.log(error);
        }
    }


    const [user, setUser] = useState(null);

    useEffect(() => {
        checkCookie().then(r => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
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