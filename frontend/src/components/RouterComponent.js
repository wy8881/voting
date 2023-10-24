import React, { useContext } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch, Routes, Navigate} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';

const RouterComponent = () => {
    const { user } = useContext(UserContext);

    function LoggedRoute({Component}) {
        if (user) {
            console.log("user is logged in")
            return <Component/>;
        } else {
            console.log("user is not logged in")
            return <Navigate to="/login" replace />;
        }
    }

    function NotloggedRoute({Component}) {
        if (!user) {
            console.log("user is not logged in")
            return <Component/>;
        } else {
            console.log("user is logged in")
            return <Navigate to="/dashboard" replace />;
        }
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<NotloggedRoute Component={Login} />}/>
                <Route path="/signup" element={<NotloggedRoute Component={Register} />}/>
                <Route path="/dashboard" element={<LoggedRoute Component={Dashboard} />}/>
            </Routes>
        </Router>
    );
};

export default RouterComponent;