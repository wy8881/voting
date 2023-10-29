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
            await api.post('api/auth/logout').then(navigate('/login'));
            deleteUser();

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

    async function getUserDetails() {
        try {
            const response = await api.get('api/auth/user');
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function getAuthDetails() {
        try {
            const response = await api.get('api/auth/checkCookie');
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {user && user.username ? (
                <>
                <p>Welcome, {user.username}!</p>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={dontClick}>Don't click</button>
                <button onClick={() => navigate('/dashboard/ballot')}>Vote</button>
                <button onClick={getUserDetails}>Get user details</button>
                <button onClick={getAuthDetails}>Get auth details</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
