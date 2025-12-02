import React, {useContext, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import api from "../api/axiosConfig";
import {UserContext} from "../contexts/UserContext";
import {isUsernameValid, setToken, decodeJwtToken} from "../utils/Utils";
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import '../styles/Register.css'
import withNoLogged from "./witNotLogged";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogging, setIsLogging] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    const DEMO_PASSWORD = "2qmbWuNHy!HI";

    const sanitizeUsername = (value) => {
        let sanitized = value.trim();
        sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
        return sanitized;
    };

    const sanitizePassword = (value) => {
        return value.trim();
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        const sanitized = value.replace(/[<>\"'&]/g, '');
        setUsername(sanitized);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
    };
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLogging(true);
        
        const sanitizedUsername = sanitizeUsername(username);
        const sanitizedPassword = sanitizePassword(password);
        
        if (!sanitizedUsername || !sanitizedPassword) {
            toast.error("Username and password cannot be empty");
            setIsLogging(false);
            return;
        }

        if (!isUsernameValid(sanitizedUsername)) {
            toast.error("Invalid username format");
            setIsLogging(false);
            return;
        }

        try {
            const resp = await api.post('api/auth/authenticate', {
                "username": sanitizedUsername,
                "password": sanitizedPassword
            })
            setToken(resp, api, "Login failed")
            const tokenData = decodeJwtToken(resp.data.token);
            const newUser = {
                username: resp.data.username,
                email: resp.data.email,
                role: tokenData ? tokenData.role : resp.data.role,
                isVoted: resp.data.isVoted,
                isDemoAccount: resp.data.isDemoAccount
            }
            setUser(newUser);
            navigate(`/dashboard`);
        }
        catch (error) {
            if(error.response && error.response.status === 401) {
                toast.error("Unmatched username or password");
            }
            else if(error.response){
                toast.error(error.response.data.message || "An error occurred");
            }
            else if(error.request) {
                toast.error("Network error: Unable to connect to server. Please check if the server is running.");
            }
            else {
                toast.error(error.message || "An unexpected error occurred");
            }
        }
        finally {
            setIsLogging(false)
        }
    }

    return (
        <div className="register-container">
            <Toaster position="top-center" />
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className = 'input-label' htmlFor='username'>Username</label>
                    <input
                        className="input-field"
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className="input-container">
                    <label className = 'input-label' htmlFor='password'>Password</label>
                    <div className="password-input-wrapper">
                        <input
                            className="input-field"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <button
                            type="button"
                            className="password-toggle-button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <div className="button-container">
                    <button className="button primary-loginbutton" type={"submit"}>{isLogging? "Log in..." : "Log In"}</button>
                    <Link to={"/signup"} className="button button-link secondary-loginbutton"> Sign Up </Link>
                </div>
            </form>
            
            <div className="demo-accounts-info">
                <h3>Demo Accounts</h3>
                <div className="demo-account-list">
                    <div className="demo-account-item">
                        <strong>Voter:</strong>
                        <div className="demo-account-credential">Username: <code>voterdemo</code></div>
                        <div className="demo-account-credential">Password: <code>{DEMO_PASSWORD}</code></div>
                    </div>
                    <div className="demo-account-item">
                        <strong>Delegate:</strong>
                        <div className="demo-account-credential">Username: <code>delegatedemo</code></div>
                        <div className="demo-account-credential">Password: <code>{DEMO_PASSWORD}</code></div>
                    </div>
                    <div className="demo-account-item">
                        <strong>Admin:</strong>
                        <div className="demo-account-credential">Username: <code>admindemo</code></div>
                        <div className="demo-account-credential">Password: <code>{DEMO_PASSWORD}</code></div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default withNoLogged(Login);