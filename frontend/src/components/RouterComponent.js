import React, {useContext, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import Ballot from './Ballot';
import Candidates from "./Candidates";
import Parties from "./Parties";
import App from "../App";
import CreateNewParty from "./CreateNewParty";
import ManageParties from "./ManageParties";
import CreateNewCandidate from "./CreateNewCandidate";
import ManageCandidates from "./ManageCandidates";

function PageTitle() {
    const location = useLocation();
    useEffect(()=> {
        let title;
        switch (location.pathname) {
            case '/':
                title = "E-Voting System";
                break;
            case '/login':
                title = "Login";
                break;
            case '/signup':
                title = "Sign Up";
                break;
            case '/dashboard':
                title = "Dashboard";
                break;
            case '/dashboard/ballot':
                title = "Ballot";
                break;
            case '/dashboard/candidates':
                title = "Candidates";
                break;
            case '/dashboard/parties':
                title = "Parties";
                break;
            case '/dashboard/parties/create':
                title = "Create New Party";
                break;
            case '/dashboard/parties/manage':
                title = "Manage Parties";
                break;
            case '/dashboard/candidates/create':
                title = "Create New Candidate";
                break;
            default:
                title = "E-Voting System";
        }
        document.title = title;

    },[location]);
    return null;
}
export default function RouterComponent() {
    const { user } = useContext(UserContext);

    function LoggedRoute({Component}) {
        if (user || localStorage.getItem('user')) {
            return <Component/>;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    function NotloggedRoute({Component}) {
        if (!((user || localStorage.getItem('user')))) {
            return <Component/>;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return (
        <Router>
            <PageTitle />
            <Routes>
                <Route path="/" element={<App/>} />
                <Route path="/login" element={<NotloggedRoute Component={Login} />}/>
                <Route path="/signup" element={<NotloggedRoute Component={Register} />}/>
                <Route path="/dashboard" element={<LoggedRoute Component={Dashboard} />}/>
                <Route path="/dashboard/ballot" element = {<LoggedRoute Component={Ballot} />}/>
                <Route path="/dashboard/candidates" element={<LoggedRoute Component={Candidates} /> } />
                <Route path="/dashboard/parties" element={<LoggedRoute Component={Parties} /> } />
                <Route path="/dashboard/parties/create" element={<LoggedRoute Component={CreateNewParty} /> } />
                <Route path="/dashboard/parties/manage" element={<ManageParties/>} />
                <Route path="/dashboard/candidates/create" element={<LoggedRoute Component={CreateNewCandidate} /> } />
                <Route path="/dashboard/candidates/manage" element={<ManageCandidates/>} />
            </Routes>
        </Router>
    );
};
