import React, { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import api from '../api/axiosConfig';
import Sidebar from "./Sidebar";
import '../styles/Dashboard.css';

export default function Dashboard(props) {
    const { user  } = useContext(UserContext);
    const navigate = useNavigate();

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

    function getUser() {
        console.log(user);
        console.log(user.isVoted)
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

    async function getTestDelegate(){
        try {
            const response = await api.get('api/delegate/test');
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
                    <div className="dashboardContainer">
                        <Sidebar />
                        <h1 className="dashboardText"> Welcome {user.username} </h1>
                        {user && user.role === 'ROLE_DELEGATE' ? (
                            <>
                            <h1 className="dashboardText"> You are a delegate </h1>
                            </>
                        ) : (
                            <>
                            {user.isVoted.toString() === 'true' ? (
                                <>
                                    <h1 className="dashboardText"> You have voted </h1>
                                </>
                            ) : (
                                <>
                                    <h1 className="dashboardText"> You have not voted </h1>
                                </>
                            )}
                            </>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
