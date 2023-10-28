import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import api from '../api/axiosConfig';

export default function Dashboard(props) {
    const { user, deleteUser } = useContext(UserContext);
    const navigate = useNavigate();


    async function handleLogout() {
        try {
            console.log('logging out')
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
                <button onClick={() => navigate('/dashboard/ballot')}>Vote</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
