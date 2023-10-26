import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import api from '../api/axiosConfig';

export default function Dashboard(props) {
    const { user, deleteUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.username) {
            navigate('/login');
        }
    }, [user, navigate]);

    async function handleLogout() {
        try {
            deleteUser();
            await api.post('api/auth/logout').then(navigate('/login'));
        }
        catch (error) {
            console.log(error);
        }
    }

    async function dontClick(e) {
        e.preventDefault();
        await api.get('api/voter').then(resp => {
            console.log(resp.data)
        })
    }

    return (
        <div>
            {user && user.username ? (
                <>
                <p>Welcome, {user.username}!</p>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={dontClick}>Don't click</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
