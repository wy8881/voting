import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import api from "../api/axiosConfig";
import '../styles/Register.css';
import { UserContext } from "../contexts/UserContext";
import {isEmailValid, isPasswordValid, isUsernameValid, setToken, decodeJwtToken} from "../utils/Utils";
import withNoLogged from "./witNotLogged";
import PasswordHelp from "./PasswordHelp";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [errors, setErrors] = useState({ username: "", password: "", email: "" });
    const [touched, setTouched] = useState({ username: false, password: false, email: false });
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const validateUsername = (value) => {
        if (value === "") {
            return "Username cannot be empty";
        }
        if (!isUsernameValid(value)) {
            return "Username can only contain numbers and alphabets";
        }
        return "";
    };

    const validatePassword = (value) => {
        if (value === "") {
            return "Password cannot be empty";
        }
        if (!isPasswordValid(value)) {
            return "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&#)";
        }
        return "";
    };

    const validateEmail = (value) => {
        if (value === "") {
            return "Email cannot be empty";
        }
        if (!isEmailValid(value)) {
            return "Invalid email format";
        }
        return "";
    };

    const shouldShowError = (field) => {
        return touched[field] && errors[field];
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (touched.username) {
            setErrors(prev => ({ ...prev, username: validateUsername(value) }));
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (touched.password) {
            setErrors(prev => ({ ...prev, password: validatePassword(value) }));
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (touched.email) {
            setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        }
    };

    const handleBlur = (field, value, validator) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({ ...prev, [field]: validator(value) }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        
        setTouched({ username: true, password: true, email: true });
        
        const usernameError = validateUsername(username);
        const passwordError = validatePassword(password);
        const emailError = validateEmail(email);
        
        if (usernameError || passwordError || emailError) {
            setErrors({
                username: usernameError,
                password: passwordError,
                email: emailError
            });
            setIsSubmitting(false);
            return;
        }

        setErrors({ username: "", password: "", email: "" });

        try {
            const resp = await api.post('api/auth/register', {
                "username": username,
                "password": password,
                "email": email
            })
            setToken(resp, api, "Register Success! Please log in.")
            const tokenData = decodeJwtToken(resp.data.token);
            const newUser = {
                username: resp.data.username,
                email: resp.data.email,
                role: tokenData ? tokenData.role : resp.data.role,
                isVoted: resp.data.isVoted
            }
            setUser(newUser);
            navigate(`/dashboard`);
        }
        catch (error) {
            if(error.response) {
                toast.error(error.response.data.message || "An error occurred");
                setErrors({
                    username: "",
                    password: "",
                    email: ""
                });
            }
            else {
                toast.error(error.message || "An unexpected error occurred");
                setErrors({
                    username: "",
                    password: "",
                    email: ""
                });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="register-container">
            <Toaster position="top-center" />
            <h1>Register</h1>
            <div className="demo-notice" style={{
                padding: '12px 16px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '6px',
                marginBottom: '24px',
                color: '#856404',
                fontSize: '0.9rem'
            }}>
                <strong>Notice:</strong> This is a demo project. Account registration is not available. Please use the existing demo accounts provided on the login page.
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="input-label" htmlFor="username">Username</label>
                    <input
                        className={`input-field ${shouldShowError('username') ? 'input-error' : ''}`}
                        id="username"
                        type="username"
                        value={username}
                        maxLength={10}
                        onChange={handleUsernameChange}
                        onBlur={() => handleBlur('username', username, validateUsername)}
                    />
                    {shouldShowError('username') ? (
                        <span className="error-message">{errors.username}</span>
                    ) : (
                        <span className="helper-text">Only use numbers and alphabets for username</span>
                    )}
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="email">Email</label>
                    <input
                        className={`input-field ${shouldShowError('email') ? 'input-error' : ''}`}
                        id="email"
                        type="email"
                        value={email}
                        maxLength={20}
                        onChange={handleEmailChange}
                        onBlur={() => handleBlur('email', email, validateEmail)}
                    />
                    {shouldShowError('email') && (
                        <span className="error-message">{errors.email}</span>
                    )}
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="password">Password</label>
                    <input
                        className={`input-field ${shouldShowError('password') ? 'input-error' : ''}`}
                        id="password"
                        type="password"
                        value={password}
                        maxLength={20}
                        onChange={handlePasswordChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => {
                            setIsPasswordFocused(false);
                            handleBlur('password', password, validatePassword);
                        }}
                    />
                    {shouldShowError('password') && (
                        <span className="error-message">{errors.password}</span>
                    )}
                    <PasswordHelp password={password} isFocused={isPasswordFocused} />
                </div>
                <div className="button-container">
                    <button
                        className="button primary-loginbutton"
                        type="submit"
                        disabled={true}
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    >
                        Register
                    </button>
                    <Link to={"/login"} className="button button-link secondary-loginbutton">Back to log in</Link>
                </div>
            </form>
        </div>
    );
}
export default withNoLogged(Register);

