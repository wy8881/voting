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
        if(user && user.role === 'ROLE_DELEGATE') {
            setButton1Text("Candidates");
            setButton2Text("Parties");
            setButton3Text("Results");
        }
        else if(location.pathname === '/dashboard/ballot' ) {
            setButton1Text("Results");
        }
        else if(location.pathname === '/dashboard/result') {
            setButton1Text("Results");
        }
        else if(location.pathname === '/dashboard/logs') {
            setButton1Text("Logs");
        }
        else if(location.pathname === '/dashboard') {
            if(user && user.role === 'ROLE_VOTER') {
                setButton1Text("Results")
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
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2>2025 Animal Senate Election</h2>
                    </Link>
                </div>
                <div className="navbar-navigation">
                    {user && user.role === 'ROLE_VOTER' && (
                        <Link to="/dashboard/ballot" 
                            className={`navbar-nav-link ${location.pathname.startsWith('/dashboard/ballot') ? 'active' : ''}`}>
                            Ballot
                        </Link>
                    )}
                    {user && user.role === 'ROLE_DELEGATE' && (
                        <>
                            <Link 
                                to="/dashboard/candidates" 
                                className={`navbar-nav-link ${location.pathname.startsWith('/dashboard/candidates') ? 'active' : ''}`}
                            >
                                Candidates
                            </Link>
                            <Link 
                                to="/dashboard/parties" 
                                className={`navbar-nav-link ${location.pathname.startsWith('/dashboard/parties') ? 'active' : ''}`}
                            >
                                Parties
                            </Link>
                            <Link 
                                to="/dashboard/result" 
                                className={`navbar-nav-link ${location.pathname === '/dashboard/result' ? 'active' : ''}`}
                            >
                                Results
                            </Link>
                        </>
                    )}
                    {user && user.role === 'ROLE_LOGGER' && (
                        <Link to="/dashboard/logs"
                             className={`navbar-nav-link ${location.pathname === '/dashboard/logs' ? 'active' : ''}`}>
                            {button1Text}
                        </Link>
                    )}
                    {user && user.role === 'ROLE_ADMIN' && (
                        <Link to="/dashboard/admin_management" 
                            className={`navbar-nav-link ${location.pathname === '/dashboard/admin_management' ? 'active' : ''}`}>
                            Manage Accounts
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

