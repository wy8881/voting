import React, {createContext, useEffect, useState} from 'react';
import api from "../api/axiosConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    async function checkCookie() {
        try {
            const response = await api.get('api/auth/checkCookie');
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
        checkCookie().then(reloadUser);
    },[]);

    useEffect(() => {
        if (user) {
            const storedUser = localStorage.getItem('user');
            if(!storedUser || storedUser !== JSON.stringify(user)) {
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