import React, {useContext, useState} from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/axiosConfig";
import {UserContext} from "../contexts/UserContext";

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    const[response, setResponse] = useState("Hasn't login");
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const {user} = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/register', {
                "username": username,
                "password": password,
                "email": email
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
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            <p>{response}</p>
        </div>
    );
}