import React, {useContext, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import api from "../api/axiosConfig";
import {UserContext} from "../contexts/UserContext";
import {isPasswordValid, isUsernameValid, setToken} from "../utils/Utils";
import '../styles/Register.css'
import withNoLogged from "./witNotLogged";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogging, setIsLogging] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);


    function handleError(message) {
        window.alert(message);
        setUsername("");
        setPassword("");
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLogging(true)
        if(username === "" || password === "") {
            handleError("Username and password cannot be empty")
            return;
        }
        if(!isUsernameValid(username)) {
            handleError("Username can only contain numbers and alphabets")
            return;
        }
        if(!isPasswordValid(password)) {
            handleError("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character. The special characters are @$!%*?&#")
            return;
        }
        try {
            const resp = await api.post('api/auth/authenticate', {
                "username": username,
                "password": password
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
                handleError("Unmatched username or password")
            }
            else if(error.response){
                handleError(error.response.data.message)
            }
            else {
                handleError(error.message)
            }
        }
        finally {
            setIsLogging(false)
        }
    }

    return (
        <div className="register-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className = 'input-label' htmlFor='username'>Username</label>
                    <input
                        className="input-field"
                        id="username"
                        type="username"
                        placeholder="username"
                        value={username}
                        maxLength={10}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <label className = 'input-label' htmlFor='password'>Password</label>
                    <input
                        className="input-field"
                        id="password"
                        type="password"
                        placeholder="password"
                        value={password}
                        maxLength={20}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="button-container">
                    <button className='register-button' type={"submit"}>{isLogging? "logging" : "log in "}</button>
                    <Link to={"/signup"}>
                        <button className="button" > Go to Register </button>
                    </Link>
                </div>

            </form>
        </div>

    );
}
export default withNoLogged(Login);