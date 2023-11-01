import React, { useContext } from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import Ballot from './Ballot';
import Candidates from "./Candidates";
import Parties from "./Parties";
import App from "../App";
import CreateNewParty from "./CreateNewParty";

const RouterComponent = () => {
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
            <Routes>
                <Route path="/" element={<App/>} />
                <Route path="/login" element={<NotloggedRoute Component={Login} />}/>
                <Route path="/signup" element={<NotloggedRoute Component={Register} />}/>
                <Route path="/dashboard" element={<LoggedRoute Component={Dashboard} />}/>
                <Route path="/dashboard/ballot" element = {<LoggedRoute Component={Ballot} />}/>
                <Route path="/dashboard/candidates" element={<LoggedRoute Component={Candidates} /> } />
                <Route path="/dashboard/parties" element={<LoggedRoute Component={Parties} /> } />
                <Route path="/dashboard/parties/create" element={<LoggedRoute Component={CreateNewParty} /> } />
            </Routes>
        </Router>
    );
};

export default RouterComponent;