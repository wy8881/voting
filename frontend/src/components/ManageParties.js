import {useContext, useEffect, useState} from "react";
import api from '../api/axiosConfig';
import {UserContext} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import '../styles/DelegatePage.css';

export default function ManageParties() {
    const [parties, setParties] = useState([]);
    const [received, setReceived] = useState(false);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    useEffect(() => {
        async function fetchParties() {
            try {
                await api.get('api/user/allParties').then(resp => {
                    setParties(resp.data);
                    setReceived(true)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchParties();
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
                    {parties && parties.length > 0 && parties.map(party => (
                        <div className={'delegate-row'}>
                            <div>Name: {party.name}</div>
                            {party.candidates.length > 0 ? <div>Candidates: {party.candidates.join(', ')}</div> : <div>No Candidates</div>}
                        </div>
                    ))}
                    {parties && parties.length === 0 && (
                        <div>No parties</div>
                    )}
                </>
            )}
        </div>
    );
}