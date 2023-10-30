import React, { useContext } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch, Routes, Navigate} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import Ballot from './Ballot';

const RouterComponent = () => {
    const { user } = useContext(UserContext);

    function LoggedRoute({Component}) {
        if (user) {
            return <Component/>;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    function NotloggedRoute({Component}) {
        if (!(user && user.username)) {
            return <Component/>;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<NotloggedRoute Component={Login} />}/>
                <Route path="/signup" element={<NotloggedRoute Component={Register} />}/>
                <Route path="/dashboard" element={<LoggedRoute Component={Dashboard} />}/>
                <Route path="/dashboard/ballot" element = {<LoggedRoute Component={Ballot} />}/>
            </Routes>
        </Router>
    );
};

export default RouterComponent;