import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import Ballot from './Ballot';
import Candidates from "./Candidates";
import Parties from "./Parties";
import CreateNewParty from "./CreateNewParty";
import ManageParties from "./ManageParties";
import CreateNewCandidate from "./CreateNewCandidate";
import ManageCandidates from "./ManageCandidates";
import Logs from "./Logs";
import CheckResult from "./CheckResult";
import Layout from "./Layout";
import AdminManagement from "./AdminManagement";

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
            case '/dashboard/admin_management':
                title = "Manage Accounts";
                break;
            default:
                title = "E-Voting System";
        }
        document.title = title;

    },[location]);
    return null;
}
export default function RouterComponent() {
    return (
        <Router>
            <PageTitle />
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Register />}/>
                <Route path="/dashboard" element={<Layout><Dashboard/></Layout>}/>
                <Route path="/dashboard/ballot" element={<Layout><Ballot/></Layout>}/>
                <Route path="/dashboard/candidates" element={<Layout><Candidates/></Layout>} />
                <Route path="/dashboard/parties" element={<Layout><Parties/></Layout>} />
                <Route path="/dashboard/parties/create" element={<Layout><CreateNewParty/></Layout>} />
                <Route path="/dashboard/parties/manage" element={<Layout><ManageParties/></Layout>} />
                <Route path="/dashboard/candidates/create" element={<Layout><CreateNewCandidate/></Layout>} />
                <Route path="/dashboard/candidates/manage" element={<Layout><ManageCandidates/></Layout>} />
                <Route path={"/dashboard/logs"} element={<Layout><Logs/></Layout>} />
                <Route path = "/dashboard/result" element={<Layout><CheckResult/></Layout>} />
                <Route path = "/dashboard/admin_management" element={<Layout><AdminManagement/></Layout>} />
            </Routes>
        </Router>
    );
};
