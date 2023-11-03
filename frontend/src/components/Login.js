import React, {useContext, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import api from "../api/axiosConfig";
import {UserContext} from "../contexts/UserContext";
import {isUsernameValid} from "../utils/Utils";
import '../styles/Register.css'

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const {deleteUser} = useContext(UserContext);


    function handleError(message) {
        window.alert(message);
        setUsername("");
        setPassword("");
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if(username === "" || password === "") {
            handleError("Username and password cannot be empty")
            return;
        }
        if(!isUsernameValid(username)) {
            handleError("Username can only contain numbers and alphabets")
            return;
        }
        try {
            await api.post('api/auth/authenticate', {
                "username": username,
                "password": password
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
            if(error.response.status === 401) {
                handleError("Invalid username or password")
            }
        }
    }

    async function dontClick(e) {
        e.preventDefault();
        await api.get('api/voter').then(resp => {
            console.log(resp.data)
        })
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
                    <button className='register-button' type={"submit"}>Login</button>
                    <Link to={"/signup"}>
                        <button className="button" > Go to Register </button>
                    </Link>
                </div>

            </form>
            <button onClick={dontClick}>Don't click</button>
            <button onClick={deleteUser}>DeleteUser</button>
        </div>

    );
}