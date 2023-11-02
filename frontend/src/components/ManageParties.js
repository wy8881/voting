import {useContext, useEffect, useState} from "react";
import api from '../api/axiosConfig';
import {UserContext} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";

export default function ManageParties() {
    const{parties, setParties} = useState(null);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    useEffect(() => {
        if(!user || localStorage.getItem('user')) {
            navigate('/login')
        }
        async function fetchParties() {
            try {
                await api.get('api/delegate/allParties').then(resp => {
                    // setParties(resp.data.parties)
                    console.log(resp.data)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchParties();
    },[]);

    return (
        <div className="container">
            <h1>Manage Parties</h1>
        </div>
    );
}