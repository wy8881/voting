import React, {createContext, useEffect, useState} from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            console.log('getting user' + JSON.parse(storedUser))
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            console.log('setting user')
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            console.log('removing user')
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