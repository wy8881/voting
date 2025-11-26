import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import '../styles/Dashboard.css';
import withRoleAccess from "./withRoleAcess";


const Dashboard = () => {
    const { user  } = useContext(UserContext);

    return (
        <>
            {user && user.username ? (
                <div className="dashboardContainer">
                    <div className="dashboard-card">
                        <h1 className="dashboardText">Welcome back, {user.username}</h1>
                        <div className="dashboard-info-section">
                            <p className="dashboardInfo">Role: {user.role.split("_")[1].toLowerCase()}</p>
                            {user.role === "ROLE_VOTER" && (
                                <>
                                    <p className="dashboardInfo">Status: {user.isVoted.toString() === 'true' ? "Voted" : "Not voted"}</p>
                                    {user.isVoted.toString() === 'false' ? (
                                        <Link to="/dashboard/ballot" className="button register-button dashboard-vote-button">
                                            Go to vote
                                        </Link>
                                    ) : (
                                        <p className="dashboard-thanks">Thanks for your participation</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="loading">Loading...</p>
            )}
        </>
    );
};

export default withRoleAccess(Dashboard, "ROLE_USER");
