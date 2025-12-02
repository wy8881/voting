import React, {createContext, useEffect, useState, useRef} from 'react';
import api from "../api/axiosConfig";
import {reloadToken, decodeJwtToken, getRoleFromToken, getUsernameFromToken} from "../utils/Utils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    async function checkAuth() {
        try {
            reloadToken(api)
            const response = await api.get('api/auth/checkAuth');
            const isAuth = response.data;
            if (isAuth === false ) {
                deleteUser();
            }
        } catch (error) {
            console.log(error);
            deleteUser();
        }
    }


    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isInitialized = useRef(false);

    useEffect(() => {
        if(isInitialized.current) return;
        async function initialize() {
            try{
                const token = sessionStorage.getItem('Bearer');
                if (token) {
                    const tokenData = decodeJwtToken(token);
                    if (tokenData) {
                        const cachedUser = sessionStorage.getItem('user');
                        if (cachedUser) {
                            const user = JSON.parse(cachedUser);
                            user.role = tokenData.role;
                            user.username = tokenData.username;
                            setUser(user);
                        } else {
                            setUser({
                                username: tokenData.username,
                                role: tokenData.role
                            });
                        }
                    } else {
                        const cachedUser = sessionStorage.getItem('user');
                        if (cachedUser) {
                            setUser(JSON.parse(cachedUser));
                        }
                    }
                } else {
                    const cachedUser = sessionStorage.getItem('user');
                    if (cachedUser) {
                        setUser(JSON.parse(cachedUser));
                    }
                }

                await checkAuth();
            } catch (error) {
                console.error('Error initializing user context:', error);
            } finally {
                setLoading(false);
                isInitialized.current = true;
            }
        }
        initialize();
    }, []);

    useEffect(() => {
        if (isInitialized.current && user) {
            const storedUser = sessionStorage.getItem('user');
            if(!storedUser || storedUser !== JSON.stringify(user)) {
                sessionStorage.setItem('user', JSON.stringify(user));
            }
        }
    }, [user]);

    function reloadUser() {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }

    const deleteUser = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };



    return (
        <UserContext.Provider value={{ user, setUser, deleteUser, loading}}>
            {children}
        </UserContext.Provider>
    );
};