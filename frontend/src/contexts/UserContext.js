import React, {createContext, useEffect, useState} from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
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
    };



    return (
        <UserContext.Provider value={{ user, setUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};