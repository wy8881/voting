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
            if(user.role === 'ROLE_VOTER') {
                setButton1Text("Results")
                setButton2Text("Vote");
            }
            else if(user.role === 'ROLE_DELEGATE') {
                setButton1Text("Candidates");
                setButton2Text("Parties");
                setButton3Text("Results")
            }
            else if(user.role === 'ROLE_LOGGER') {
                setButton1Text("Logs");
            }
        }
    }, [location, user.role]);
    

    async function handleLogout() {
        try {
            console.log('logging out')
            await api.get('api/auth/logout').then(() => {
                navigate('/login');
                deleteUser();
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="sidebar-container">
            {user && user.role === 'ROLE_VOTER' && (
                <>
                    {user.isVoted.toString() === 'false' && (
                            <Link to={location.pathname === '/dashboard'
                            || '/dashabord/result' ? '/dashboard/ballot' : '/dashboard'}>
                                <button className="sidebar-button">{button2Text}</button>
                            </Link>
                        )}
                </>
            )}
            {user && user.role === 'ROLE_DELEGATE' && (
                <>
                    <Link to={location.pathname === '/dashboard'
                    || location.pathname === '/dashboard/parties'
                    || location.pathname === '/dashboard/parties/create'
                    || location.pathname === '/dashboard/parties/manage'
                    || location.pathname === '/dashboard/results'
                        ? '/dashboard/candidates' : '/dashboard'} >
                        <button className="sidebar-button">{button1Text}</button>
                    </Link>
                    <Link to={location.pathname === '/dashboard'
                    || location.pathname === '/dashboard/candidates'
                    || location.pathname === '/dashboard/candidates/create'
                    || location.pathname === '/dashboard/candidates/manage'
                    || location.pathname === '/dashboard/results'
                        ? '/dashboard/parties' : '/dashboard'}>
                        <button className="sidebar-button">{button2Text}</button>
                    </Link>
                    <Link to={location.pathname === '/dashboard'
                    || location.pathname === '/dashboard/candidates'
                    || location.pathname === '/dashboard/candidates/create'
                    || location.pathname === '/dashboard/candidates/manage'
                    || location.pathname === '/dashboard/parties'
                    || location.pathname === '/dashboard/parties/create'
                    || location.pathname === '/dashboard/parties/manage'
                        ? '/dashboard/result' : '/dashboard'}>
                        <button className="sidebar-button">{button3Text}</button>
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