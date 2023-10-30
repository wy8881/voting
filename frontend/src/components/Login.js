import React, {useContext, useState} from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/axiosConfig";
import {UserContext} from "../contexts/UserContext";
import {isUsernameValid} from "../utils/Utils";

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const[response, setResponse] = useState("Hasn't login");
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const {user} = useContext(UserContext);
    const {deleteUser} = useContext(UserContext);


    async function handleSubmit(e) {
        e.preventDefault();
        if(!isUsernameValid(username)) {
            window.alert("Username can only contain numbers and alphabets");
            setUsername("");
            setPassword("");
            return;
        }
        try {
            await api.post('api/auth/authenticate', {
                "username": username,
                "password": password
            }).then(resp => {
                setResponse(resp.data)
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
            console.log(error);
        }

        // navigate("/");
    }

    async function dontClick(e) {
        e.preventDefault();
        await api.get('api/voter').then(resp => {
            console.log(resp.data)
        })
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="username"
                    placeholder="username"
                    value={username}
                    maxLength={10}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    maxLength={20}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type={"submit"}>Login</button>
            </form>
            {
                user &&
                <>
                Username: {user.username} <br />
                Email: {user.email} <br />
                Role: {user.role} <br />
                Status: {response.status} <br />
                </>
            }

            <button onClick={dontClick}>Don't click</button>
            <button onClick={deleteUser}>DeleteUser</button>
        </div>

    );
}