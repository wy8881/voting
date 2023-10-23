import React, { useContext } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch, Routes} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Login from './Login';
import Dashboard from './Dashboard';

const RouterComponent = () => {
    const { user } = useContext(UserContext);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" />
                {user && user.username && (
                    <Route path={`/dashboard/${user.username}`} element={<Dashboard />}>
                    </Route>
                )}
            </Routes>
        </Router>
    );
};

export default RouterComponent;