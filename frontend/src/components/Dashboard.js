import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function Dashboard(props) {
    const { user, deleteUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.username) {
            navigate('/login');
        }
    }, [user, navigate]);

    function handleLogout() {
        deleteUser();
        //Todo: add a logout endpoint in the backend which can delete the cookie
        navigate('/login');
    }

    return (
        <div>
            {user && user.username ? (
                <>
                <p>Welcome, {user.username}!</p>
                <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
