import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useRoleCheck } from '../hooks/useRoleCheck';
import api from '../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { confirm } from '../utils/confirmDialog';
import '../styles/Dashboard.css';
import withRoleAccess from "./withRoleAcess";


const Dashboard = () => {
    const { user } = useContext(UserContext);
    const { isAdmin } = useRoleCheck();
    const navigate = useNavigate();
    const [electionStatus, setElectionStatus] = useState(null);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            fetchElectionStatus();
        }
    }, [user]);

    async function fetchElectionStatus() {
        setIsLoadingStatus(true);
        try {
            const response = await api.get('api/user/electionStatus');
            if (response.data && response.data.electionStarted !== undefined) {
                setElectionStatus(response.data);
            } else {
                setElectionStatus({ electionStarted: false });
            }
        } catch (error) {
            console.error('Failed to fetch election status:', error);
            if (error.response?.status === 403) {
                toast.error('You do not have permission to view election status.');
            } else if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setElectionStatus({ electionStarted: false });
            }
        } finally {
            setIsLoadingStatus(false);
        }
    }

    async function handleStartElection() {
        const confirmed = await confirm({
            title: 'Start Election',
            message: 'Are you sure you want to start the election?',
            confirmText: 'Start Election',
            variant: 'default'
        });
        
        if (!confirmed) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.post('api/admin/startElection');
            toast.success(response.data.message);
            await fetchElectionStatus();
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('You do not have permission to start the election.');
            } else if (error.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to start election');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleStopElection() {
        const confirmed = await confirm({
            title: 'Stop Election',
            message: 'Are you sure you want to stop the election?',
            confirmText: 'Stop Election',
            variant: 'danger'
        });
        
        if (!confirmed) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.post('api/admin/stopElection');
            toast.success(response.data.message);
            await fetchElectionStatus();
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('You do not have permission to stop the election.');
            } else if (error.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to stop election');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            {user && user.username ? (
                <div className="dashboardContainer">
                    <div className="dashboard-card">
                        <h1 className="dashboardText">Welcome back, {user.username}</h1>
                        <div className="dashboard-info-section">
                            <div className="election-status-section">
                                <h3 className="election-status-title">Current Election Status</h3>
                                {isLoadingStatus ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                                        <ClipLoader color="#2563EB" size={30} />
                                    </div>
                                ) : (
                                    <div className="election-status-pill-container">
                                        <span className={`status-pill ${electionStatus?.electionStarted ? 'status-active' : 'status-inactive'}`}>
                                            {electionStatus?.electionStarted ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {isAdmin() && (
                                <div className="admin-election-control-section">
                                    <h3 className="election-status-title">Election Controls</h3>
                                    <p className="dashboardInfo" style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                                        Manage the election status. Start the election to allow voting, or stop it to close voting.
                                    </p>
                                    <div className="election-buttons">
                                        <button
                                            className="button admin-create-button election-button"
                                            onClick={handleStartElection}
                                            disabled={isSubmitting || isLoadingStatus || electionStatus?.electionStarted}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Start Election'}
                                        </button>
                                        <button
                                            className="button admin-delete-button election-button"
                                            onClick={handleStopElection}
                                            disabled={isSubmitting || isLoadingStatus || !electionStatus?.electionStarted}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Stop Election'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {user.role === "ROLE_VOTER" && (
                                <div className="voter-status-section">
                                    <h3 className="election-status-title">Your Vote:</h3>
                                    <p className="dashboardInfo">Voting Status: {user.isVoted.toString() === 'true' ? "Voted" : "Not voted"}</p>
                                    {user.isVoted.toString() === 'false' ? (
                                        <Link to="/dashboard/ballot" className="button register-button dashboard-vote-button">
                                            Go to vote
                                        </Link>
                                    ) : (
                                        <div className="dashboard-thanks-wrapper">
                                            <p className="dashboard-thanks">Thanks for your participation!</p>
                                            <p className="dashboard-thanks">You can review the results once the election closes.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <ClipLoader color="#2563EB" size={50} />
                </div>
            )}
        </>
    );
};

export default withRoleAccess(Dashboard, "ROLE_USER");
