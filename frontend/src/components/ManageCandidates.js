import {useContext, useEffect, useState} from "react";
import api from '../api/axiosConfig';
import {UserContext} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import '../styles/DelegatePage.css';

export default function ManageCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [received, setReceived] = useState(false);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    useEffect(() => {
        async function fetchCandidates() {
            try {
                await api.get('api/delegate/allCandidates').then(resp => {
                    setCandidates(resp.data);
                    setReceived(true)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchCandidates();
    },[]);

    useEffect(() => {
        if (!user && !localStorage.getItem('user')) {
            navigate('/login')
        }
    })

    return (
        <div className="delegate-container">
            <Sidebar />
            <h1>Manage Parties</h1>
            {!received ?(
                <div>Loading...</div>
            ) : (
                <>
                    {candidates && candidates.length > 0 && candidates.map(candidate => (
                        <div className={'delegate-row'}>
                            <div>Name: {candidate.name}</div>
                            <div>Party: {candidate.party}</div>
                        </div>
                    ))}
                    {candidates && candidates.length === 0 && (
                        <div>No candidates</div>
                    )}
                </>
            )}
        </div>
    );
}