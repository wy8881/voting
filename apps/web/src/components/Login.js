import React, {useContext, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import api from "../api/axiosConfig";
import {UserContext} from "../contexts/UserContext";
import {isUsernameValid, setToken} from "../utils/Utils";
import '../styles/Register.css'
import withNoLogged from "./witNotLogged";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogging, setIsLogging] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

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
            const newUser = {
                username: resp.data.username,
                email: resp.data.email,
                role: resp.data.role,
                isVoted: resp.data.isVoted
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
                        maxLength={10}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className="input-container">
                    <label className = 'input-label' htmlFor='password'>Password</label>
                    <input
                        className="input-field"
                        id="password"
                        type="password"
                        value={password}
                        maxLength={20}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="button-container">
                    <button className="button primary-loginbutton" type={"submit"}>{isLogging? "Log in..." : "Log In"}</button>
                    <Link to={"/signup"} className="button button-link secondary-loginbutton"> Sign Up </Link>
                </div>

            </form>
        </div>

    );
}
export default withNoLogged(Login);