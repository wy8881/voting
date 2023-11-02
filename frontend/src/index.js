import React from "react";
import ReactDOM from "react-dom/client";
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
