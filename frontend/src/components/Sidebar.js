import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import "../styles/Sidebar.css";
import api from "../api/axiosConfig";
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
export default function Sidebar() {
    const { user, deleteUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location =  useLocation();
    const [button1Text, setButton1Text] = useState();
    const [button2Text, setButton2Text] = useState();

    useEffect(() => {
        if(location.pathname === '/dashboard/ballot' ) {
            setButton2Text("Dashboard");
        }
        else if(location.pathname === '/dashboard/candidates') {
            setButton1Text("Dashboard");
            setButton2Text("Parties");
        }
        else if(location.pathname === '/dashboard/parties') {
            setButton1Text("Candidates");
            setButton2Text("Dashboard");
        }
        else if(location.pathname === '/dashboard/logs') {
            setButton1Text("Dashboard");
        }
        else if(location.pathname === '/dashboard') {
            if(user.role === 'ROLE_VOTER') {
                setButton1Text("check vote")
                setButton2Text("Vote");
            }
            else if(user.role === 'ROLE_DELEGATE') {
                setButton1Text("Candidates");
                setButton2Text("Parties");
            }
            else if(user.role === 'ROLE_LOGGER') {
                setButton1Text("Logs");
            }
        }
    }, [location, user.role]);
    

    async function handleLogout() {
        try {
            console.log('logging out')
            await api.get('api/auth/logout').then(navigate('/login'));
            deleteUser();

        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="sidebar-container">
            {user && user.role === 'ROLE_VOTER' && (
                <>
                    {user.isVoted === 'true' ? (
                        <>
                            <Link to={location.pathname === '/dashboard' ? '/dashboard/ballot' : '/dashboard'}>
                                <button className="sidebar-button">{button1Text}</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={location.pathname === '/dashboard' ? '/dashboard/ballot' : '/dashboard'}>
                                <button className="sidebar-button">{button2Text}</button>
                            </Link>
                        </>
                    )}
                </>
            )}
            {user && user.role === 'ROLE_DELEGATE' && (
                <>
                    <Link to={location.pathname === '/dashboard'? '/dashboard/candidates' : '/dashboard'} >
                        <button className="sidebar-button">{button1Text}</button>
                    </Link>
                    <Link to={location.pathname === '/dashboard' ? '/dashboard/parties' : '/dashboard'}>
                        <button className="sidebar-button">{button2Text}</button>
                    </Link>
                </>
            )}
            {user && user.role === 'ROLE_LOGGER' && (
                <>
                    <Link to={location.pathname === '/dashboard' ? '/dashboard/logs' : '/dashboard'}>
                        <button className="sidebar-button">{button1Text}</button>
                    </Link>
                </>
            )}
            <button className="sidebar-button" onClick={handleLogout}>Log out</button>
        </div>

    );
}