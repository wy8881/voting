import React, {useContext} from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import api from "../api/axiosConfig";
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
export default function Sidebar() {
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

    return (
        <div>
            {user && user.role === 'ROLE_VOTER' ? (
                <>
                <div className="sidebar-container">
                    {user.isVoted === 'true' ? (
                        <>
                            <Link to="/page2">
                                <button className="sidebar-button">Check you vote</button>
                            </Link>
                        </>
                        ) : (
                        <>
                            <Link to="/dashboard/ballot">
                                <button className="sidebar-button">Vote</button>
                            </Link>
                        </>
                    )}
                    <Link to>
                        <button className="sidebar-button" onClick={handleLogout}>Log out</button>
                    </Link>
                </div>
                </>
            ) : (
                <>
                    <div className="sidebar-container">
                        <Link to="/dashboard/candidates">
                            <button className="sidebar-button">Candidates</button>
                        </Link>
                        <Link to="/dashboard/parties">
                            <button className="sidebar-button">Parties</button>
                        </Link>
                        <Link >
                            <button className="sidebar-button" onClick={handleLogout}>Log out</button>
                        </Link>
                    </div>
                </>
            )
            }
        </div>
    );
}