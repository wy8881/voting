import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="bg-primary" style={{ minHeight: '100vh' }}>
            {user && <Navbar />}
            {children}
        </div>
    );
};

export default Layout;

