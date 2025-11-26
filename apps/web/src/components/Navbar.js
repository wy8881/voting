import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import api from '../api/axiosConfig';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, deleteUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [button1Text, setButton1Text] = useState();
    const [button2Text, setButton2Text] = useState();
    const [button3Text, setButton3Text] = useState();

    useEffect(() => {
        if(location.pathname === '/dashboard/ballot' ) {
            setButton1Text("Results");
            setButton2Text("Dashboard");
        }
        else if(location.pathname === '/dashboard/result') {
            setButton1Text("Candidates");
            setButton2Text("Parties");
            setButton3Text("Dashboard")
        }
        else if(location.pathname === '/dashboard/candidates') {
            setButton1Text("Dashboard");
            setButton2Text("Parties");
            setButton3Text("Results")
        }
        else if(location.pathname === '/dashboard/parties') {
            setButton1Text("Candidates");
            setButton2Text("Dashboard");
            setButton3Text("Results")
        }
        else if(location.pathname === '/dashboard/parties/manage') {
            setButton1Text("Candidates");
            setButton2Text("Dashboard");
            setButton3Text("Results")
        }
        else if(location.pathname === '/dashboard/candidates/manage') {
            setButton1Text("Dashboard");
            setButton2Text("Parties");
            setButton3Text("Results")
        }
        else if(location.pathname === '/dashboard/parties/create') {
            setButton1Text("Candidates");
            setButton2Text("Dashboard");
            setButton3Text("Results")
        }
        else if(location.pathname === '/dashboard/candidates/create') {
            setButton1Text("Dashboard");
            setButton2Text("Parties");
            setButton3Text("Results")
        }
        else if(location.pathname === '/dashboard/logs') {
            setButton1Text("Dashboard");
        }
        else if(location.pathname === '/dashboard') {
            if(user && user.role === 'ROLE_VOTER') {
                setButton1Text("Results")
            }
            else if(user && user.role === 'ROLE_DELEGATE') {
                setButton1Text("Candidates");
                setButton2Text("Parties");
                setButton3Text("Results")
            }
            else if(user && user.role === 'ROLE_LOGGER') {
                setButton1Text("Logs");
            }
        }
    }, [location, user]);

    async function handleLogout() {
        try {
            await api.get('api/auth/logout');
        } catch (error) {
            console.log(error);
        } finally {
            sessionStorage.removeItem('Bearer');
            delete api.defaults.headers.common['Authorization'];
            deleteUser();
            navigate('/login');
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <h2>E-Voting System</h2>
                </div>
                <div className="navbar-navigation">
                    {user && user.role === 'ROLE_VOTER' && (
                        <Link to="/dashboard/result" className="navbar-nav-link">
                            {button1Text}
                        </Link>
                    )}
                    {user && user.role === 'ROLE_DELEGATE' && (
                        <>
                            <Link to={location.pathname === '/dashboard'
                            || location.pathname === '/dashboard/parties'
                            || location.pathname === '/dashboard/parties/create'
                            || location.pathname === '/dashboard/parties/manage'
                            || location.pathname === '/dashboard/results'
                                ? '/dashboard/candidates' : '/dashboard'} className="navbar-nav-link">
                                {button1Text}
                            </Link>
                            <Link to={location.pathname === '/dashboard'
                            || location.pathname === '/dashboard/candidates'
                            || location.pathname === '/dashboard/candidates/create'
                            || location.pathname === '/dashboard/candidates/manage'
                            || location.pathname === '/dashboard/results'
                                ? '/dashboard/parties' : '/dashboard'} className="navbar-nav-link">
                                {button2Text}
                            </Link>
                            <Link to={location.pathname === '/dashboard'
                            || location.pathname === '/dashboard/candidates'
                            || location.pathname === '/dashboard/candidates/create'
                            || location.pathname === '/dashboard/candidates/manage'
                            || location.pathname === '/dashboard/parties'
                            || location.pathname === '/dashboard/parties/create'
                            || location.pathname === '/dashboard/parties/manage'
                                ? '/dashboard/result' : '/dashboard'} className="navbar-nav-link">
                                {button3Text}
                            </Link>
                        </>
                    )}
                    {user && user.role === 'ROLE_LOGGER' && (
                        <Link to={location.pathname === '/dashboard' ? '/dashboard/logs' : '/dashboard'} className="navbar-nav-link">
                            {button1Text}
                        </Link>
                    )}
                </div>
                <div className="navbar-user">
                    {user && user.username && (
                        <span className="navbar-username">Hi, {user.username}</span>
                    )}
                    <button className="navbar-logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

