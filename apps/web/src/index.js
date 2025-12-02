import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import { UserProvider } from "./contexts/UserContext";
import RouterComponent from "./components/RouterComponent";

const root = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(
    <React.StrictMode>
        <UserProvider>
            <RouterComponent/>
        </UserProvider>
    </React.StrictMode>
);
