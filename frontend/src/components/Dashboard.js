import React, { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import api from '../api/axiosConfig';
import Sidebar from "./Sidebar";
import '../styles/Dashboard.css';
import withRoleAccess from "./withRoleAcess";


const Dashboard = () => {
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
                        <h1 className="dashboardText"> You are a {user.role.split("_")[1].toLowerCase()} </h1>
                        {user.role === "ROLE_VOTER" && (
                            <>
                                <h1 className="dashboardText"> You have {user.isVoted.toString() === 'true' ? "voted" : "not voted"} </h1>
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

export default withRoleAccess(Dashboard, "ROLE_USER");
