import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.username) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div>
            {user && user.username ? (
                <p>Welcome, {user.username}!</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;