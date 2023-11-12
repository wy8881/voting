import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/axiosConfig";
import '../styles/Register.css';
import { UserContext } from "../contexts/UserContext";
import '../styles/Register.css'
import {isPasswordValid, isUsernameValid} from "../utils/Utils";
import { checkPasswordStrength } from "../utils/passwordStrengthChecker";
import withNoLogged from "./witNotLogged";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [strength, setStrength] = useState({});
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    function handlePasswordChange(e) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setStrength(checkPasswordStrength(newPassword));
    }

    function handleError(message) {
        window.alert(message);
        setIsSubmitting(false)
        setUsername("");
        setPassword("");
        setEmail("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true)
        if (username === "" || password === "" || email === "") {
            handleError("Username, password and email cannot be empty")
            return;
        }
        if (!isUsernameValid(username)) {
            handleError("Username can only contain numbers and alphabets")
            return;
        }
        if(!isPasswordValid(password)) {
            handleError("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character. The special characters are @$!%*?&#")
            return;
        }
        try {
            await api.post('api/auth/register', {
                "username": username,
                "password": password,
                "email": email
            }).then(resp => {
                const newUser = {
                    username: resp.data.username,
                    email: resp.data.email,
                    role: resp.data.role,
                    isVoted: resp.data.isVoted
                }
                setUser(newUser);
                navigate(`/dashboard`);
            })
        }
        catch (error) {
            if (error.response.status === 400) {
                handleError(error.response.data.message)
            }
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="input-label" htmlFor="username">Username</label>
                    <input
                        className="input-field"
                        id="username"
                        type="username"
                        placeholder="username"
                        value={username}
                        maxLength={10}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="helper-text">Only use numbers and alphabets for username</span>
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="email">email</label>
                    <input
                        className="input-field"
                        id="email"
                        type="email"
                        placeholder="email"
                        value={email}
                        maxLength={20}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="password">password</label>
                    <input
                        className="input-field"
                        id="password"
                        type="password"
                        placeholder="password"
                        value={password}
                        maxLength={20}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div>
                    {strength.weak && <span style={{ color: 'red' }}>Weak</span>}
                    {strength.moderate && <span style={{ color: 'orange' }}>Moderate</span>}
                    {strength.strong && <span style={{ color: 'green' }}>Strong</span>}
                </div>
                <ul>
                    {strength.failedCriteria?.map((criteria, index) => (
                        <li key={index} style={{ color: 'red' }}>{criteria.message}</li>
                    ))}
                </ul>
                <div className="button-container">
                    <button
                        className="button register-button"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                    <Link to={"/login"}>
                        <button className="button" type="button">Return to Log in</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
export default withNoLogged(Register);

