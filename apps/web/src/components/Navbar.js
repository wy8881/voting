import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import api from '../api/axiosConfig';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, deleteUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeMenu}>
                            <h2>2025 Animal Senate Election</h2>
                        </Link>
                    </div>
                    <button className="navbar-burger" onClick={toggleMenu} aria-label="Toggle menu">
                        <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    </button>
                    <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                        <button className="navbar-close-button" onClick={closeMenu} aria-label="Close menu">
                            <span className="close-icon">×</span>
                        </button>
                    <div className="navbar-navigation">
                        {user && user.role === 'ROLE_VOTER' && (
                            <>
                                <Link to="/dashboard/ballot" 
                                    className={`navbar-nav-link ${location.pathname.startsWith('/dashboard/ballot') ? 'active' : ''}`}
                                    onClick={closeMenu}>
                                    Ballot
                                </Link>
                                <Link 
                                    to="/dashboard/voter_result" 
                                    className={`navbar-nav-link ${location.pathname === '/dashboard/voter_result' ? 'active' : ''}`}
                                    onClick={closeMenu}>
                                    Results
                                </Link>
                            </>
                        )}
                        {user && user.role === 'ROLE_DELEGATE' && (
                            <>
                                <Link 
                                    to="/dashboard/candidates" 
                                    className={`navbar-nav-link ${location.pathname.startsWith('/dashboard/candidates') ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Candidates
                                </Link>
                                <Link 
                                    to="/dashboard/parties" 
                                    className={`navbar-nav-link ${location.pathname.startsWith('/dashboard/parties') ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Parties
                                </Link>
                                <Link 
                                    to="/dashboard/result" 
                                    className={`navbar-nav-link ${location.pathname === '/dashboard/result' ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Results
                                </Link>
                            </>
                        )}
                        {user && user.role === 'ROLE_LOGGER' && (
                            <Link to="/dashboard/logs"
                                 className={`navbar-nav-link ${location.pathname === '/dashboard/logs' ? 'active' : ''}`}
                                 onClick={closeMenu}>
                                Logs
                            </Link>
                        )}
                        {user && user.role === 'ROLE_ADMIN' && (
                            <Link to="/dashboard/admin_management" 
                                className={`navbar-nav-link ${location.pathname === '/dashboard/admin_management' ? 'active' : ''}`}
                                onClick={closeMenu}>
                                Manage Accounts
                            </Link>
                        )}
                    </div>
                    <div className="navbar-user">
                        {user && user.username && (
                            <span className="navbar-username">Hi, {user.username}</span>
                        )}
                        <button className="navbar-logout-button" onClick={() => { closeMenu(); handleLogout(); }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        </>
    );
};

export default Navbar;

