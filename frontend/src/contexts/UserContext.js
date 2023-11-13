import React, {createContext, useEffect, useState} from 'react';
import api from "../api/axiosConfig";
import {reloadToken} from "../utils/Utils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    async function checkAuth() {
        try {
            reloadToken(api)
            const response = await api.get('api/auth/checkAuth');
            const isAuth = response.data;
            if (isAuth === false ) {
                console.log("not auth")
                deleteUser();
            }
        } catch (error) {
            console.log(error);
            deleteUser();
        }
    }


    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth().then(reloadUser);
    },[]);

    useEffect(() => {
        if (user) {
            const storedUser = localStorage.getItem('user');
            if(!storedUser || storedUser !== JSON.stringify(user)) {
                console.log("setUser")
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        if(user === null) {
            reloadUser();
        }
    }, [user]);

    function reloadUser() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false)
    }

    const deleteUser = () => {
        localStorage.removeItem('user');
        setUser(null);
    };



    return (
        <UserContext.Provider value={{ user, setUser, deleteUser, loading}}>
            {children}
        </UserContext.Provider>
    );
};