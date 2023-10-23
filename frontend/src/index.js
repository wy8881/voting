import React from "react";
import ReactDOM from "react-dom";
import { UserProvider } from "./contexts/UserContext";
import RouterComponent from "./components/RouterComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import { UserContext } from './contexts/UserContext';

ReactDOM.render(
    <React.StrictMode>
        <UserProvider>
            <RouterComponent />
        </UserProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
