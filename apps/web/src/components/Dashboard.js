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
